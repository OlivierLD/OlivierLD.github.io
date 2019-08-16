"use strict";

const sunPathVerbose = false;
const SUNPATH_TAG_NAME = 'sun-path';

if (Math.toRadians === undefined) {
	Math.toRadians = (deg) => {
		return deg * (Math.PI / 180);
	};
}

import * as Utilities from "../utilities/Utilities.js";
import '../utilities/date.proto.js';

const sunPathDefaultColorConfig = {
	bgColor: 'black', // Used if withGradient = false
	withGradient: true,
	displayBackgroundGradient: {
		from: 'blue',
		to: 'black'
	},
	font: 'Arial',
	sunColor: 'yellow',
	cardPointColor: 'white',
	altitudeValueColor: 'cyan',
	gridColor: 'rgba(0, 205, 205, 0.75)',
	baseColor: 'rgba(0, 205, 205, 0.5)'
};

/* global HTMLElement */
class SunPath extends HTMLElement {

	static get observedAttributes() {
		return [
			"width",   // Integer. Canvas width, default 400 px;
			"height",  // Integer. Canvas height, default 400 px;
			"tilt",    // Float. The inclination of the base. Default 10 degrees
			"z-offset" // Float. Z offset, default 0 degrees
		];
	}

	constructor() {
		super();
		this._shadowRoot = this.attachShadow({mode: 'open'}); // 'open' means it is accessible from external JavaScript.
		// create and append a <canvas>
		this.canvas = document.createElement("canvas");
		let fallbackElemt = document.createElement("h1");
		let content = document.createTextNode("This is a SunPath, on an HTML5 canvas");
		fallbackElemt.appendChild(content);
		this.canvas.appendChild(fallbackElemt);
		this.shadowRoot.appendChild(this.canvas);

		// Default values
		this._tilt = -10;  // Around X
		this.rotation = 0; // Around Y. Leave that one unchanged. We don't use this axis.
		this._zOffset = 0; // Around Z
		this._width = 400;
		this._height = 400;

		this._sunData = undefined;
		this._sunPath = undefined;

		this.sunHe = undefined;
		this.sunZ = undefined;
		this.moonHe = undefined;
		this.moonZ = undefined;

		this.userPosition = undefined;
		this._sunRise = undefined;
		this._sunSet = undefined;
		this._sunTransit = undefined;
		this._now = undefined; // epoch

		this.side =   0; // Left and right
		this.addToZ = 180;  // 180 when pointing South (Sun in the South at noon). Combined with left right rotation
		this.invertX =  1;  // +1/-1 . +1 when pointing south

		this._previousClassName = "";
		this.sunPathColorConfig = sunPathDefaultColorConfig;
	}

	// Called whenever the custom element is inserted into the DOM.
	connectedCallback() {
		if (sunPathVerbose) {
			console.log("connectedCallback invoked.");
		}
	}

	// Called whenever the custom element is removed from the DOM.
	disconnectedCallback() {
		if (sunPathVerbose) {
			console.log("disconnectedCallback invoked");
		}
	}

	// Called whenever an attribute is added, removed or updated.
	// Only attributes listed in the observedAttributes property are affected.
	attributeChangedCallback(attrName, oldVal, newVal) {
		if (sunPathVerbose) {
			console.log("attributeChangedCallback invoked on " + attrName + " from " + oldVal + " to " + newVal);
		}
		// Use height, width, tilt. sunPath & sunData are provided after...
		switch (attrName) {
			case "tilt":
				this._tilt = parseFloat(newVal);
				break;
			case "z-offset":
				this._zOffset = parseFloat(newVal);
				break;
			case "width":
				this._width = parseInt(newVal);
				break;
			case "height":
				this._height = parseInt(newVal);
				break;
			default:
				break;
		}
		this.repaint();
	}

	// Called whenever the custom element has been moved into a new document.
	adoptedCallback() {
		if (sunPathVerbose) {
			console.log("adoptedCallback invoked");
		}
	}

	set tilt(val) {
		this.setAttribute("tilt", val);
		if (sunPathVerbose) {
			console.log(">> tilt option:", val);
		}
	}

	set zOffset(val) {
		this.setAttribute("z-offset", val);
		if (sunPathVerbose) {
			console.log(">> z-offset option:", val);
		}
	}

	set width(val) {
		this.setAttribute("width", val);
	}

	set height(val) {
		this.setAttribute("height", val);
	}

	set sunPath(json) {
		this._sunPath = json;
		// Check where to point here (N or S)
		let lastAlt = -90;
		let lastZ = 0;
		for (let idx=0; idx<json.length; idx++) {
			if (json[idx].alt < lastAlt) { // Culmination reached
				let zAtNoon = lastZ;
	//		console.log("Z at noon:", zAtNoon);
				if (zAtNoon > 90 && zAtNoon < 270) {
					this.invertX = 1;   // +1 when pointing south
					if (sunPathVerbose) {
						console.log(this.id + ", Pointing South at Noon");
					}
				} else {
					this.invertX = -1;  // -1 when pointing north
					if (sunPathVerbose) {
						console.log(this.id + ", Pointing North at Noon");
					}
				}
				break;
			} else {
				lastAlt = json[idx].alt;
				lastZ = json[idx].z;
			}
		}
	}

	set sunData(json) {
		this._sunData = json;
		this.sunPos = { he: this._sunData.altitude, z: this._sunData.z };
	}

	set sunPos(sunPos) {
		this.sunHe = sunPos.he;
		this.sunZ = sunPos.z;
	}

	set moonPos(moonPos) {
		this.moonHe = moonPos.he;
		this.moonZ = moonPos.z;
	}

	set userPos(position) { // { latitude: xxx, longitude: xxx }
		this.userPosition = position;
	}

	set sunRise(sr) { // { time: epoch, z: degrees }
		this._sunRise = sr;
	}

	set sunSet(ss) { // { time: epoch, z: degrees }
		this._sunSet = ss;
	}

	set sunTransit(st) { // { time: epoch }
		this._sunTransit = st;
	}

	set now(st) { // { time: epoch }
    this._now = st;
	}

	set shadowRoot(val) {
		this._shadowRoot = val;
	}

	get tilt() {
		return this._tilt;
	}

	get zOffset() {
		return this._zOffset;
	}

	get width() {
		return this._width;
	}

	get height() {
		return this._height;
	}

	get shadowRoot() {
		return this._shadowRoot;
	}

	// Component methods
	getColorConfig(classNames) {
		let colorConfig = sunPathDefaultColorConfig;
		let classes = classNames.split(" ");
		for (let cls = 0; cls < classes.length; cls++) {
			let cssClassName = classes[cls];
			for (let s = 0; s < document.styleSheets.length; s++) {
				// console.log("Walking though ", document.styleSheets[s]);
				try {
					for (let r = 0; document.styleSheets[s].cssRules !== null && r < document.styleSheets[s].cssRules.length; r++) {
						let selector = document.styleSheets[s].cssRules[r].selectorText;
						//			console.log(">>> ", selector);
						if (selector !== undefined && (selector === '.' + cssClassName || (selector.indexOf('.' + cssClassName) > -1 && selector.indexOf(SUNPATH_TAG_NAME) > -1))) { // Cases like "tag-name .className"
							//				console.log("  >>> Found it! [%s]", selector);
							let cssText = document.styleSheets[s].cssRules[r].style.cssText;
							let cssTextElems = cssText.split(";");
							cssTextElems.forEach((elem) => {
								if (elem.trim().length > 0) {
									let keyValPair = elem.split(":");
									let key = keyValPair[0].trim();
									let value = keyValPair[1].trim();
									switch (key) {
										case '--bg-color':
											colorConfig.bgColor = value;
											break;
										case '--display-background-gradient-from':
											colorConfig.displayBackgroundGradient.from = value;
											break;
										case '--display-background-gradient-to':
											colorConfig.displayBackgroundGradient.to = value;
											break;
										case '--with-gradient':
											colorConfig.withGradient = value === 'true';
											break;
										case '--grid-color':
											colorConfig.gridColor = value;
											break;
										case '--base-color':
											colorConfig.baseColor = value;
											break;
										case '--sun-color':
											colorConfig.sunColor = value;
											break;
										case '--font':
											colorConfig.font = value;
											break;
										case '--card-point-color':
											colorConfig.cardPointColor = value;
											break;
										case '--altitude-value-color':
											colorConfig.altitudeValueColor = value;
											break;
										default:
											break;
									}
								}
							});
						}
					}
				} catch (err) {
					// Absorb
				}
			}
		}
		return colorConfig;
	}

	repaint() {
		this.drawSunPath();
	}

	/**
	 * Used to draw a globe
	 * alpha, then beta
	 *
	 * @param lat in degrees
	 * @param lng in degrees
	 * @return x, y, z. Cartesian coordinates.
	 */
	rotateBothWays(lat, lng, rotationAroundY, rotationAroundX, addToLng) {

		let x = Math.cos(Math.toRadians(lat)) * Math.sin(Math.toRadians(lng + addToLng));
		let y = Math.sin(Math.toRadians(lat));
		let z = Math.cos(Math.toRadians(lat)) * Math.cos(Math.toRadians(lng + addToLng));

		let alfa = Math.toRadians(rotationAroundY); // in plan (x, z), y unchanged.
		let beta = Math.toRadians(rotationAroundX); // in plan (y, z), x unchanged. Tilt.
		/*
		 * Note:
		 * x is the x of the screen
		 * y is the y of the screen
		 * z goes through the screen
		 *
		 *                      |  cos a -sin a  0 |  a > 0 : counter-clockwise
		 * Rotation plan x, y:  |  sin a  cos a  0 |
		 *                      |    0     0     1 |
		 *
		 *                      | 1    0      0    |  b > 0 : towards user
		 * Rotation plan y, z:  | 0  cos b  -sin b |
		 *                      | 0  sin b   cos b |
		 *
		 *  | x |   | cos a -sin a  0 |   | 1   0      0    |   | x |   |  cos a  (-sin a * cos b) (sin a * sin b) |
		 *  | y | * | sin a  cos a  0 | * | 0  cos b -sin b | = | y | * |  sin a  (cos a * cos b) (-cos a * sin b) |
		 *  | z |   |  0      0     1 |   | 0  sin b  cos b |   | z |   |   0          sin b           cos b       |
		 */

		// All in once
		let _x = (x * Math.cos(alfa)) - (y * Math.sin(alfa) * Math.cos(beta)) + (z * Math.sin(alfa) * Math.sin(beta));
		let _y = (x * Math.sin(alfa)) + (y * Math.cos(alfa) * Math.cos(beta)) - (z * Math.cos(alfa) * Math.sin(beta));
		let _z = (y * Math.sin(beta)) + (z * Math.cos(beta));

		return {x: _x, y: _y, z: _z};
	}


	drawSunPath() {

		let currentStyle = this.className;
		if (this._previousClassName !== currentStyle || true) {
			// Reload
			//	console.log("Reloading CSS");
			try {
				this.sunPathColorConfig = this.getColorConfig(currentStyle);
			} catch (err) {
				// Absorb?
				console.log(err);
			}

			this._previousClassName = currentStyle;
		}

		let context = this.canvas.getContext('2d');
		let scale = 1.0;

		if (this.width === 0 || this.height === 0) { // Not visible
			return;
		}
		// Set the canvas size from its container.
		this.canvas.width = this.width;
		this.canvas.height = this.height;

		let radius = (this.canvas.width / 2) * .8;

		if (this.sunPathColorConfig.withGradient) {
			let grd = context.createLinearGradient(0, 5, 0, 2 * radius);
			grd.addColorStop(0, this.sunPathColorConfig.displayBackgroundGradient.from); // 0  Beginning
			grd.addColorStop(0.5, 'orange'); // middle
			grd.addColorStop(1, this.sunPathColorConfig.displayBackgroundGradient.to);   // 1  End
			context.fillStyle = grd;
		} else {
			context.fillStyle = this.sunPathColorConfig.bgColor;
		}

		// Background
		context.fillRect(0, 0, this.canvas.width, this.canvas.height);

		let center = {
			x: this.canvas.width / 2,
			y: this.canvas.height / 2
		};

		// Base
		let minZ = this._sunData !== undefined ? 10 * Math.floor(this._sunData.riseZ / 10) : 90,
				maxZ = this._sunData !== undefined ? 10 * Math.ceil(this._sunData.setZ / 10) : 270;
		if (this.invertX === -1) { // Pointing North
			let tmp = maxZ - 360;
			maxZ = minZ + 10;
			minZ = tmp - 10;
		}

		context.strokeStyle = this.sunPathColorConfig.gridColor;
		// Base
		context.lineWidth = 1;
		// Full circle, dotted
		context.save();
		context.setLineDash([2, 2]);
		context.beginPath();
		for (let alfa=0; alfa<=360; alfa += 1) {
//		console.log("Base rotation", rotation);
			let panelPoint = this.rotateBothWays(this.rotation, alfa, this.side, this._tilt * this.invertX, (this.addToZ + (this.invertX * this._zOffset)));
			if (alfa === 0) {
				context.moveTo(center.x + (panelPoint.x * radius), center.y - (panelPoint.y * radius));
			} else {
				context.lineTo(center.x + (panelPoint.x * radius), center.y - (panelPoint.y * radius));
			}
		}
		context.closePath();
		context.stroke();
		context.restore();

		context.lineWidth = 3;

		// Actual sector
		context.beginPath();
		context.moveTo(center.x, center.y); // Start from center
		let panelPoint = this.rotateBothWays(this.rotation, minZ, this.side, this._tilt * this.invertX, (this.addToZ + (this.invertX * this._zOffset)));
		context.lineTo(center.x + (panelPoint.x * radius), center.y - (panelPoint.y * radius));
		for (let alfa=minZ; alfa<=maxZ; alfa += 1) {
//		console.log("Base rotation", rotation);
			panelPoint = this.rotateBothWays(this.rotation, alfa, this.side, this._tilt * this.invertX, (this.addToZ + (this.invertX * this._zOffset)));
			context.lineTo(center.x + (panelPoint.x * radius), center.y - (panelPoint.y * radius));
		}
		context.closePath();
		context.stroke();
		// Fill the base
		context.fillStyle = this.sunPathColorConfig.baseColor;
		context.fill();

		// Close the base
		context.lineWidth = 1;
		panelPoint = this.rotateBothWays(this.rotation, minZ, this.side, this._tilt * this.invertX, (this.addToZ + (this.invertX * this._zOffset)));
		context.beginPath();
		context.moveTo(center.x + (panelPoint.x * radius), center.y - (panelPoint.y * radius));
		context.lineTo(center.x, center.y);
		context.lineTo(center.x + (panelPoint.x * radius), center.y - (panelPoint.y * radius));
		context.stroke();
		context.closePath();
		// Fill the base
		context.fillStyle = this.sunPathColorConfig.baseColor;
		context.fill();

		// Lines to the actual Z for rise and set
		if (this._sunData !== undefined) {
			context.save()
			context.strokeStyle = this.sunPathColorConfig.gridColor;
			context.lineWidth = 1;
			context.setLineDash([5, 3]); // [2, 2]);

			panelPoint = this.rotateBothWays(this.rotation, this._sunData.riseZ, this.side, this._tilt * this.invertX, (this.addToZ + this._zOffset));
			// From center to sunrise
			context.beginPath();
			context.moveTo(center.x, center.y);
			context.lineTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			context.stroke();
			context.closePath();

			panelPoint = this.rotateBothWays(this.rotation, this._sunData.setZ, this.side, this._tilt * this.invertX, (this.addToZ + this._zOffset));
			// From center to sunset
			context.beginPath();
			context.moveTo(center.x, center.y);
			context.lineTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			context.stroke();
			context.closePath();
			context.restore();
		}

		// Cardinal points
		context.save();
		let fontSize = 20;
		context.font = "bold " + Math.round(fontSize) + "px " + this.sunPathColorConfig.font;
		context.fillStyle = this.sunPathColorConfig.cardPointColor;
		let len = 0;

		panelPoint = this.rotateBothWays(this.rotation, 180, this.side, this._tilt, (this.addToZ + this._zOffset));
//	context.moveTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
		let text = (this.invertX === 1 ? "S" : "N");
		let metrics = context.measureText(text);
		len = metrics.width;
		context.fillText(text, center.x + (panelPoint.x * radius) - (len / 2), center.y - (panelPoint.y * radius));

		panelPoint = this.rotateBothWays(this.rotation, 90, this.side, this._tilt, (this.addToZ + this._zOffset));
		context.moveTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
		text = (this.invertX === 1 ? "E" : "W");
		metrics = context.measureText(text);
		len = metrics.width;
		context.fillText(text, center.x + (panelPoint.x * radius) - (len / 2), center.y - (panelPoint.y * radius));

		panelPoint = this.rotateBothWays(this.rotation, 270, this.side, this._tilt, (this.addToZ + this._zOffset));
		context.moveTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
		text = (this.invertX === 1 ? "W" : "E");
		metrics = context.measureText(text);
		len = metrics.width;
		context.fillText(text, center.x + (panelPoint.x * radius) - (len / 2), center.y - (panelPoint.y * radius));

		context.restore();

		// Meridians.
		for (let alfa = minZ; alfa <= maxZ; alfa += 10) { // Longitude
			panelPoint = this.rotateBothWays(this.rotation, alfa, this.side, this._tilt * this.invertX, (this.addToZ + (this.invertX * this._zOffset)));
			context.beginPath();
			context.moveTo(center.x + (panelPoint.x * radius), center.y - (panelPoint.y * radius));
			for (let beta = 0; beta <= 90; beta += 1) { // Latitude
				panelPoint = this.rotateBothWays(beta + this.rotation, alfa, this.side, this._tilt * this.invertX, (this.addToZ + (this.invertX * this._zOffset)));
				context.lineTo(center.x + (panelPoint.x * radius), center.y - (panelPoint.y * radius));
			}
			context.stroke();
			context.closePath();
		}

		// Parallels
		for (let alfa = 10; alfa < 90; alfa += 10) { // Latitude
			panelPoint = this.rotateBothWays(alfa + this.rotation, minZ, this.side, this._tilt * this.invertX, (this.addToZ + (this.invertX * this._zOffset)));
			context.beginPath();
			context.moveTo(center.x + (panelPoint.x * radius), center.y - (panelPoint.y * radius));
			for (let beta = minZ; beta <= maxZ; beta += 1) { // Longitude
				panelPoint = this.rotateBothWays(alfa + this.rotation, beta, this.side, this._tilt * this.invertX, (this.addToZ + (this.invertX * this._zOffset)));
				context.lineTo(center.x + (panelPoint.x * radius), center.y - (panelPoint.y * radius));
			}
			context.stroke();
			context.closePath();
			// Altitude Labels
			text = alfa + "°";
			context.fillStyle = this.sunPathColorConfig.altitudeValueColor;
			context.beginPath();
			panelPoint = this.rotateBothWays(alfa + this.rotation, 180, this.side, this._tilt, (this.addToZ + this._zOffset));
			context.moveTo(center.x + (panelPoint.x * radius), center.y - (panelPoint.y * radius));
			metrics = context.measureText(text);
			len = metrics.width;
			context.fillText(text, center.x + (panelPoint.x * radius) - (len / 2), center.y - (panelPoint.y * radius));
			context.closePath();
		}

		// Sun Path
		if (this._sunPath !== undefined) {
			context.lineWidth = 3;
			// Positive elevations
			context.strokeStyle = this.sunPathColorConfig.sunColor;
			// panelPoint = this.rotateBothWays(this._sunPath[0].alt + this.rotation, this._sunPath[0].z, this.side, this._tilt * this.invertX, (this.addToZ + this._zOffset));
			panelPoint = this.rotateBothWays(0 + this.rotation, this._sunData.riseZ, this.side, this._tilt * this.invertX, (this.addToZ + this._zOffset));
			context.beginPath();
			context.moveTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			for (let i = 0; i < this._sunPath.length; i++) {
				if (this._sunPath[i].alt >= 0) {
					panelPoint = this.rotateBothWays(this._sunPath[i].alt + this.rotation, this._sunPath[i].z, this.side, this._tilt * this.invertX, (this.addToZ + this._zOffset));
					context.lineTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
				}
			}
			panelPoint = this.rotateBothWays(0 + this.rotation, this._sunData.setZ, this.side, this._tilt * this.invertX, (this.addToZ + this._zOffset));
			context.lineTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			context.stroke();
			context.closePath();
			context.lineWidth = 1;

			// Negative elevations
			context.save();
			context.setLineDash([2, 2]);
			context.beginPath();
			let started = false;
			for (let i = 0; i < this._sunPath.length; i++) {
				if (this._sunPath[i].alt < 0) {
					panelPoint = this.rotateBothWays(this._sunPath[i].alt + this.rotation, this._sunPath[i].z, this.side, this._tilt * this.invertX, (this.addToZ + this._zOffset));
					if (!started) {
						context.moveTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
						started = true;
					} else {
						context.lineTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
					}
				} else {
					started = false;
				}
			}
			context.stroke();
			context.closePath();
			context.restore();
		}
		// Current Sun Pos.
		if (this.sunHe !== undefined && this.sunZ !== undefined) {
			context.strokeStyle = this.sunPathColorConfig.sunColor;
			panelPoint = this.rotateBothWays(this.rotation, this.sunZ, this.side, this._tilt * this.invertX, (this.addToZ + this._zOffset)); // Horizon under the Sun
			// From center to horizon
			context.beginPath();
			context.moveTo(center.x, center.y);
			context.lineTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			context.stroke();
			context.closePath();
			// Up to the Sun
			context.beginPath();
			context.moveTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			for (let alt = 0; alt <= this.sunHe; alt++) {
				panelPoint = this.rotateBothWays(alt + this.rotation, this.sunZ, this.side, this._tilt * this.invertX, (this.addToZ + this._zOffset));
				context.lineTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			}
			panelPoint = this.rotateBothWays(this.sunHe + this.rotation, this.sunZ, this.side, this._tilt * this.invertX, (this.addToZ + this._zOffset));
			context.lineTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			context.stroke();
			context.closePath();
			// Draw the Sun
			context.fillStyle = this.sunPathColorConfig.sunColor;
			if (this.sunHe > -5 && this.sunHe < 5) {
				context.fillStyle = 'rgba(255,0,0,0.5)';
			} else if (this.sunHe < -5) {
				context.fillStyle = 'rgba(255,255,0,0.3)';
			}
			context.beginPath();
			context.arc(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius), 10, 2 * Math.PI, false);
			context.fill();
			context.closePath();
			// Dotted line to center
			context.fillStyle = this.sunPathColorConfig.sunColor;
			context.save();
			context.setLineDash([5, 3]);
			context.beginPath();
			context.moveTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			context.lineTo(center.x, center.y);
			context.stroke();
			context.closePath();
			context.restore();
			// Display values
			context.save();
			fontSize = 14;
			context.font = "" + Math.round(fontSize) + "px " + this.sunPathColorConfig.font;
			let strAlt = Utilities.decToSex(this.sunHe);
			let strZ = Utilities.decToSex(this.sunZ);
			context.fillText("Elevation:" + strAlt, 10, 20);
			context.fillText("Azimuth:" + strZ, 10, 40);
			if (this.userPosition !== undefined) {
				let strLat = Utilities.decToSex(this.userPosition.latitude, 'NS');
				let strLng = Utilities.decToSex(this.userPosition.longitude, 'EW');
				let metrics = context.measureText(strLat);
				let len = metrics.width;
				context.fillText(strLat, this._width - 10 - len, 20);
				metrics = context.measureText(strLng);
				len = metrics.width;
				context.fillText(strLng, this._width - 10 - len, 40);
			}
			context.fillStyle = this.sunPathColorConfig.cardPointColor;
			if (this._sunRise !== undefined) {
				let strRiseTime = new Date(this._sunRise.time).format('H:i:s Z');
				let strRiseZ = Utilities.decToSex(this._sunRise.z);
				context.fillText("Sun Rise", 10, this._height - 60);
				context.fillText("Time:" + strRiseTime, 10, this._height - 40);
				context.fillText("Azimuth:" + strRiseZ, 10, this._height - 20);
			}
			if (this._sunSet !== undefined) {
				let strSetTime = new Date(this._sunSet.time).format('H:i:s Z');
				let strSetZ = Utilities.decToSex(this._sunSet.z);
				let displayData = "Sun Set";
				let metrics = context.measureText(displayData);
				context.fillText(displayData, this._width - metrics.width - 10, this._height - 60);
				displayData = "Time:" + strSetTime;
				metrics = context.measureText(displayData);
				context.fillText(displayData, this._width - metrics.width - 10, this._height - 40);
				displayData = "Azimuth:" + strSetZ;
				metrics = context.measureText(displayData);
				context.fillText(displayData, this._width - metrics.width - 10, this._height - 20);
			}
			if (this._sunTransit !== undefined) {
				let strSetTime = new Date(this._sunTransit.time).format('H:i:s Z');
				let displayData = "Sun Transit";
				let metrics = context.measureText(displayData);
				context.fillText(displayData, (this._width / 2) - (metrics.width / 2), this._height - 60);
				displayData = strSetTime;
				metrics = context.measureText(displayData);
				context.fillText(displayData, (this._width / 2) - (metrics.width / 2), this._height - 40);
				if (this._now !== undefined) {
					let toTransit = Math.abs(this._sunTransit.time - this._now.time) / 1000;
					let inHours = Math.floor(toTransit / 3600);
					let inMins = Math.floor((toTransit - (inHours * 3600)) / 60);
					let inSecs = Math.floor(toTransit - ((inHours * 3600) + (inMins * 60)));
					let str = ((this._sunTransit.time - this._now.time) > 0 ? 'In ' : 'Was ') + Utilities.lpad(inHours.toString(), 2, '0') + ':' +
							Utilities.lpad(inMins.toString(), 2, '0') + ':' +
							Utilities.lpad(inSecs.toString(), 2, '0') +
							((this._sunTransit.time - this._now.time) > 0 ? '' : ' ago.');
					// console.log('To Transit:', toTransit, ' =>', str);
					displayData = str;
					metrics = context.measureText(displayData);
					context.fillText(displayData, (this._width / 2) - (metrics.width / 2), this._height - 20);
				}
			}
			if (this._sunRise !== undefined && this._sunSet !== undefined) {
				let dayLight = this._sunSet.time - this._sunRise.time;
				dayLight /= 1000; // in seconds
				let dayLightHours = Math.floor(dayLight / 3600);
				let dayLightMins = Math.floor((dayLight - (dayLightHours * 3600)) / 60);
				let dayLightSecs = Math.floor(dayLight - ((dayLightHours * 3600) + (dayLightMins * 60)));
				let str = "Daylight " +
						Utilities.lpad(dayLightHours.toString(), 2, '0') + ':' +
						Utilities.lpad(dayLightMins.toString(), 2, '0') + ':' +
						Utilities.lpad(dayLightSecs.toString(), 2, '0');
				metrics = context.measureText(str);
				context.fillText(str, (this._width / 2) - (metrics.width / 2), this._height - 2);
			}

			context.restore();
		}

		// Current Moon Pos.
		if (this.moonHe !== undefined && this.moonZ !== undefined) {
			context.strokeStyle = 'white'; // TODO Moon color this.sunPathColorConfig.sunColor;
			panelPoint = this.rotateBothWays(this.rotation, this.moonZ, this.side, this._tilt * this.invertX, (this.addToZ + this._zOffset)); // Horizon under the Moon
			// From center to horizon
			context.beginPath();
			context.moveTo(center.x, center.y);
			context.lineTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			context.stroke();
			context.closePath();
			// Up to the Moon
			context.beginPath();
			context.moveTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			for (let alt = 0; alt <= this.moonHe; alt++) {
				panelPoint = this.rotateBothWays(alt + this.rotation, this.moonZ, this.side, this._tilt * this.invertX, (this.addToZ + this._zOffset));
				context.lineTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			}
			panelPoint = this.rotateBothWays(this.moonHe + this.rotation, this.moonZ, this.side, this._tilt * this.invertX, (this.addToZ + this._zOffset));
			context.lineTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			context.stroke();
			context.closePath();
			// Draw the Moon
			context.fillStyle = 'rgba(255, 255, 255, 0.75)'; // 'white'; // TODO this.sunPathColorConfig.sunColor;
			// if (this.sunHe > -5 && this.sunHe < 5) {
			// 	context.fillStyle = 'rgba(255,0,0,0.5)';
			// } else if (this.sunHe < -5) {
			// 	context.fillStyle = 'rgba(255,255,0,0.3)';
			// }
			context.beginPath();
			context.arc(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius), 8, 2 * Math.PI, false);
			context.fill();
			context.closePath();
			// Dotted line to center
			context.fillStyle = 'white'; // TODO this.sunPathColorConfig.sunColor;
			context.save();
			context.setLineDash([5, 3]);
			context.beginPath();
			context.moveTo(center.x + (panelPoint.x * radius * this.invertX), center.y - (panelPoint.y * radius));
			context.lineTo(center.x, center.y);
			context.stroke();
			context.closePath();
			context.restore();
			// Display values
			context.save();
			fontSize = 14;
			context.font = "" + Math.round(fontSize) + "px " + this.sunPathColorConfig.font;
			let strAlt = Utilities.decToSex(this.moonHe);
			let strZ = Utilities.decToSex(this.moonZ);
			context.fillText("Elevation:" + strAlt, 10, 60);
			context.fillText("Azimuth:" + strZ, 10, 80);
			context.restore();
		}
	}

	decToSex(val, ns_ew) {
		return Utilities.decToSex(val, ns_ew);
	}

}

// Associate the tag and the class
window.customElements.define(SUNPATH_TAG_NAME, SunPath);
