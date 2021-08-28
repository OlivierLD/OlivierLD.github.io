"use strict";


// Sine of angles in degrees
export function sind(x) {
	return Math.sin(Math.toRadians(x));
}

// Cosine of angles in degrees
export function cosd(x) {
	return Math.cos(Math.toRadians(x));
}

// Tangent of angles in degrees
export function tand(x) {
	return Math.tan(Math.toRadians(x));
}

// Normalize large angles
// Degrees
export function norm360Deg(x) {
	while (x < 0) {
		x += 360;
	}
	return x % 360;
}

// Radians
export function norm2PiRad(x) {
	while (x < 0) {
		x += (2 * Math.PI);
	}
	return x % (2 * Math.PI);
}

// Cosine of normalized angle (in radians)
export function cost(x) {
	return Math.cos(norm2PiRad(x));
}

export function ghaToLongitude(gha) {
	let longitude = (gha < 180) ? -gha : 360 - gha;
	return longitude;
};

export function longitudeToGHA(longitude) {
	let gha = (longitude < 0) ? -longitude : 360 - longitude;
	return gha;
};

/*
 * See http://en.wikipedia.org/wiki/Maidenhead_Locator_System
 */
export function gridSquare(lat, lng) {
    let gridSquare = "";

    lng += 180;
    lat += 90;
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    //                0         1         2
    //                01234567890123456789012345. Useless beyond X
    let first = Math.trunc(lng / 20.0);
    gridSquare += alphabet.charAt(first);
    let second = Math.trunc(lat / 10.0);
    gridSquare += alphabet.charAt(second);

    let third = Math.trunc((lng % 20) / 2);
    gridSquare += third.toFixed(0);
    let fourth = Math.trunc(lat % 10);
    gridSquare += fourth.toFixed(0);

    let d = lng - (Math.trunc(lng / 2) * 2);
    let fifth = Math.trunc(d * 12);
    gridSquare += alphabet.toLowerCase().charAt(fifth);
    let e = lat - Math.trunc(lat);
    let sixth = Math.trunc(e * 24);
    gridSquare += alphabet.toLowerCase().charAt(sixth);

    return gridSquare;
};

export function sightReduction(lat, lng, ahg, dec) {
	let AHL = ahg + lng;
	while (AHL < 0.0) {
		AHL = 360.0 + AHL;
	}
	// Formula to solve : sin He = sin L sin D + cos L cos D cos AHL
	let sinL = Math.sin(Math.toRadians(lat));
	let sinD = Math.sin(Math.toRadians(dec));
	let cosL = Math.cos(Math.toRadians(lat));
	let cosD = Math.cos(Math.toRadians(dec));
	let cosAHL = Math.cos(Math.toRadians(AHL));

	let sinHe = (sinL * sinD) + (cosL * cosD * cosAHL);
	let He = Math.toDegrees(Math.asin(sinHe));
//  console.log("Estimated Altitude : " + He);

	// Formula to solve : tg Z = sin P / cos L tan D - sin L cos P
	let P = (AHL < 180.0) ? AHL : (360.0 - AHL);
	let sinP = Math.sin(Math.toRadians(P));
	let cosP = Math.cos(Math.toRadians(P));
	let tanD = Math.tan(Math.toRadians(dec));
	let tanZ = sinP / ((cosL * tanD) - (sinL * cosP));
	let Z = Math.toDegrees(Math.atan(tanZ));

	if (AHL < 180.0) { // vers l'West
		if (Z < 0.0) { // sud vers nord
			Z = 180.0 - Z;
		} else {         // Nord vers Sud
			Z = 360.0 - Z;
		}
	} else {           // vers l'Est
		if (Z < 0.0) { // sud vers nord
			Z = 180.0 + Z;
//    } else {       // nord vers sud
//      Z = Z;
		}
	}
//  console.log("Azimut : " + Z);
	return {
		alt: He,
		Z: Z
	};
};

if (Math.toRadians === undefined) {
	Math.toRadians = (deg) => {
		return deg * (Math.PI / 180);
	};
}

if (Math.toDegrees === undefined) {
	Math.toDegrees = (rad) => {
		return rad * (180 / Math.PI);
	};
}

/**
 * 
 * @param {*} from { lat: xxx, lng: xxx }, values in Radians
 * @param {*} to { lat: xxx, lng: xxx }, values in Radians
 * Return distance in radians
 */
 export function getGCDistance(from, to) {
	let cos = Math.sin(from.lat) * Math.sin(to.lat) + Math.cos(from.lat) * 
			  Math.cos(to.lat) * Math.cos(to.lng - from.lng);
	let dist = Math.acos(cos);
	return dist;
};


// Points coordinates in degrees, return in nautical miles.
export function getGCDistanceDegreesNM(from, to) {
	return 60.0 * Math.toDegrees(getGCDistance(
		{ lat: Math.toRadians(from.lat), lng: Math.toRadians(from.lng) },
		{ lat: Math.toRadians(to.lat), lng: Math.toRadians(to.lng) }
	));
};

const TO_NORTH = 0;
const TO_SOUTH = 1;
const TO_EAST  = 2;
const TO_WEST  = 3;

/**
 * 
 * @param {*} from { lat: xxx, lng: xxx }, values in Radians
 * @param {*} to { lat: xxx, lng: xxx }, values in Radians
 * @param {*} nbPoints 
 */
export function calculateGreatCircle(from, to, nbPoints) {
	let nsDir = (to.lat > from.lat) ? TO_NORTH : TO_SOUTH;
	let ewDir = (to.lng > from.lng) ? TO_EAST : TO_WEST;
	if (Math.abs(to.lng - from.lng) > Math.PI) { // Then turn the other way
		if (ewDir === TO_EAST) {
			ewDir = TO_WEST;
			to.lng -= (2 * Math.PI);
		} else {
			ewDir = TO_EAST;
			to.lng += (2 * Math.PI);
		}
	}
	let deltaG = to.lng - from.lng;
	let route = [];
	let interval = deltaG / nbPoints;
	let smallStart = from;
	for (let g=from.lng; route.length <= nbPoints; g+=interval) {
		let deltag = to.lng - g;
		let tanStartAngle = Math.sin(deltag) / (Math.cos(smallStart.lat) * Math.tan(to.lat) - Math.sin(smallStart.lat) * Math.cos(deltag));
		let smallL = Math.atan(Math.tan(smallStart.lat) * Math.cos(interval) + Math.sin(interval) / (tanStartAngle * Math.cos(smallStart.lat)));
		let rpG = g + interval;
		if (rpG > Math.PI) {
			rpG -= (2 * Math.PI);
		}
		if (rpG < -Math.PI) {
			rpG = (2 * Math.PI) + rpG;
		}
		let routePoint = { lat: smallL, lng: rpG };
		let ari = Math.toDegrees(Math.atan(tanStartAngle));
		if (ari < 0.0) {
			ari = Math.abs(ari);
		}
		let _nsDir;
		if (routePoint.lat > smallStart.lat) {
			_nsDir = TO_NORTH;
		} else {
			_nsDir = TO_SOUTH;
		}
		let arrG = routePoint.lng;
		let staG = smallStart.lng;
		if (Math.sign(arrG) !== Math.sign(staG)) {
			if (Math.sign(arrG) > 0) {
				arrG -= (2 * Math.PI);
			} else {
				arrG = Math.PI - arrG;
			}
		}
		let _ewDir;
		if (arrG > staG) {
			_ewDir = TO_EAST;
		} else {
			_ewDir = TO_WEST;
		}
		let _start = 0.0;
		if (_nsDir == TO_SOUTH) {
			_start = 180;
			if (_ewDir == TO_EAST) {
				ari = _start - ari;
			} else {
				ari = _start + ari;
			}
		} else if (_ewDir == TO_EAST) {
			ari = _start + ari;
		} else {
			ari = _start - ari;
		}
		while (ari < 0.0) {
			ari += 360;
		}
		route.push({ point: smallStart, z: to === smallStart ? null : ari });
		smallStart = routePoint;
	}
	return route;
};

/**
 * 
 * @param {*} obs { lat: xx, lng: xx } values in degrees
 * @param {*} sunCoord { gha: xx, dec: xx } values in degrees
 * @param {*} moonCoord { gha: xx, dec: xx } values in degrees
 */
export function getMoonTilt(obs, sunCoord, moonCoord ) {

	let moonLongitude = ghaToLongitude(moonCoord.gha);
	let sunLongitude = ghaToLongitude(sunCoord.gha);

	// Get lunar distance, to know how many points to calculate in the GC.
	let sunMoonDist = getGCDistance({lat: Math.toRadians(moonCoord.dec), lng: Math.toRadians(moonLongitude)},
									{lat: Math.toRadians(sunCoord.dec), lng: Math.toRadians(sunLongitude)});
	let inDeg = Math.toDegrees(sunMoonDist);
	let intPart = Math.trunc(inDeg);
	let minutes = 60 * (inDeg - intPart);								
	if (false) {
		console.log(`Sun-Moon distance: ${intPart + '°' + minutes.toFixed(2) + '\''}`);
	}
	let nbPoints = inDeg < 10 ? 20 : (2 * inDeg);
	let skyRoute = calculateGreatCircle({lat: Math.toRadians(moonCoord.dec), lng: Math.toRadians(moonLongitude)},
										{lat: Math.toRadians(sunCoord.dec), lng: Math.toRadians(sunLongitude)},
										nbPoints);
	let route = [];									
	skyRoute.forEach(rp => {
		let sru = sightReduction(obs.lat, obs.lng, longitudeToGHA(Math.toDegrees(rp.point.lng)), Math.toDegrees(rp.point.lat));
		route.push({observer: obs, 
					observed: { alt: sru.alt,
								z: sru.Z}});
	});									
	// Take the first triangle, from the Moon.
	/*
	 *                   . - alt1
	 *                   |
     *                   |
	 *       .-----------. - alt0
	 *       |           |
	 *      z0           z1
	 */
	let z0 = route[0].observed.z;
	let z1 = route[1].observed.z;

	let alt0 = route[0].observed.alt;
	let alt1 = route[1].observed.alt;

	let deltaZ = z1 - z0;
	if (deltaZ > 180) { // like 358 - 2, should be 358 - 362.
		deltaZ -= 360;
	}
	let deltaElev = alt1 - alt0;
	let alpha = Math.toDegrees(Math.atan2(deltaElev, deltaZ)); // atan2 from -Pi to Pi

	if (deltaElev > 0) {
		if (deltaZ > 0) { // positive angle, like 52
			alpha *= -1;
		} else { // Angle > 90, like 116
			if (alpha < 90) {
				alpha -= 90;
			} else {
				alpha = 180 - alpha;
			}
		}
	} else {
		if (deltaZ > 0) { // negative angle, like -52
			alpha *= -1;
		} else { // Negative, < -90, like -116
			if (alpha > -90) {
				alpha += 90;
			} else {
				alpha = -180 - alpha;
			}
		}
	}

	return alpha;
};

export function calcLHA(gha, longitude) {
	let lha = gha + longitude;
	while (lha > 360) {
		lha -= 360;
	}
	while (lha < 0) {
		lha += 360;
	}
	return lha;
};

/*
exports.sind = sind;
exports.cosd = cosd;
exports.tand = tand;
exports.norm360Deg = norm360Deg;
exports.norm2PiRad = norm2PiRad;
exports.cost = cost;
*/
