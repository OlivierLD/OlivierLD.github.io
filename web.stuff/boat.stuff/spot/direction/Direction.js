/*
 * @author Olivier Le Diouris
 *
 * Warining: This one is NOT a WebComponent.
 */

const directionColorConfigWhite = {
  bgColor:           'white',
  digitColor:        'black',
  withGradient:      true,
  displayBackgroundGradient: { from: 'LightGrey', to: 'white' },
  withDisplayShadow: true,
  shadowColor:       'rgba(0, 0, 0, 0.75)',
  outlineColor:      'DarkGrey',
  majorTickColor:    'black',
  minorTickColor:    'black',
  valueColor:        'grey',
  valueOutlineColor: 'black',
  valueNbDecimal:    0,
  handColor:         'rgba(0, 0, 100, 0.25)',
  handOutlineColor:  'black',
  withHandShadow:    true,
  knobColor:         'DarkGrey',
  knobOutlineColor:  'black',
  font:              'Arial' /* 'Source Code Pro' */
};

const directionColorConfigBlack = {
  bgColor:           'black',
  digitColor:        'cyan',
  withGradient:      true,
  displayBackgroundGradient: { from: 'black', to: 'LightGrey' },
  shadowColor:       'black',
  outlineColor:      'DarkGrey',
  majorTickColor:    'red',
  minorTickColor:    'red',
  valueColor:        'red',
  valueOutlineColor: 'black',
  valueNbDecimal:    0,
  handColor:         'rgba(0, 0, 100, 0.25)',
  handOutlineColor:  'blue',
  withHandShadow:    true,
  knobColor:         '#8ED6FF', // Kind of blue
  knobOutlineColor:  'blue',
  font:              'Arial'
};
let directionColorConfig = directionColorConfigWhite; 

function Direction(cName, dSize, majorTicks, minorTicks)
{
  if (majorTicks === undefined) {
    majorTicks = 45;
  }
  if (minorTicks === undefined) {
    minorTicks = 0;
  }

  let canvasName = cName;
  let displaySize = dSize;

  let scale = dSize / 100;

  let running = false;
  this.previousValue = 0.0;
  this.intervalID = 0;
  this.valueToDisplay = 0;
  this.incr = 1;
  this.busy = false;
  
  let instance = this;
  
//try { console.log('in the Direction constructor for ' + cName + " (" + dSize + ")"); } catch (e) {}
  
  this.setDisplaySize = function(ds) {
    scale = ds / 100;
    displaySize = ds;
    this.drawDisplay(canvasName, displaySize, instance.previousValue);
  };
  
  this.startStop = function (buttonName) {
//  console.log('StartStop requested on ' + buttonName);
    let button = document.getElementById(buttonName);
    running = !running;
    button.value = (running ? "Stop" : "Start");
    if (running) {
      this.animate();
    } else {
      window.clearInterval(this.intervalID);
      this.intervalID = 0;
      this.previousValue = this.valueToDisplay;
    }
  };

  function on360(angle) {
    let num = angle;
    while (num < 0) {
      num += 360;
    }
    while (num > 360) {
      num -= 360;
    }
    return num;
  }
  
  this.animate = function() {    
    let value;
    if (arguments.length === 1) {
      value = arguments[0];
    } else {
//    console.log("Generating random value");
      value = 360 * Math.random();
    }
//  console.log("Reaching Value :" + value + " from " + this.previousValue);
    diff = value - on360(this.previousValue);
    if (Math.abs(diff) > 180) { // && sign(Math.cos(toRadians(value))))
//    console.log("Diff > 180: new:" + value + ", prev:" + this.previousValue);
      if (value > on360(this.previousValue)) {
        value -= 360;
      } else {
        value += 360;
      }
      diff = value - on360(this.previousValue);
    }
    this.valueToDisplay = on360(this.previousValue);
    
//  console.log(canvasName + " going from " + this.previousValue + " to " + value);
    
    this.incr = diff / 10;
//    if (diff < 0)
//      incr *= -1;
    if (this.intervalID && this.intervalID !== 0) {
      window.clearInterval(this.intervalID);
    }
    if (this.incr !== 0 && !this.busy) {
      if (canvasName === 'twdCanvas') {   
        console.log('Starting animation between ' + this.previousValue + ' and ' + value + ', step ' + this.incr);
      }
      this.busy = true;
      this.intervalID = window.setTimeout(function () { instance.displayAndIncrement(value); }, 50);
    }
  };

  function sign(x) { return x > 0 ? 1 : x < 0 ? -1 : 0; }
  function toRadians(d) {
    return Math.PI * d / 180;
  }
  
  function toDegrees(d) {
    return d * 180 / Math.PI;
  }
  
  this.displayAndIncrement = function(finalValue) {
    //console.log('Tic ' + inc + ', ' + finalValue);
    this.drawDisplay(canvasName, displaySize, this.valueToDisplay);
    this.valueToDisplay += this.incr;
    if (canvasName === 'twdCanvas')
      console.log('       displayAndIncrement curr:' + this.valueToDisplay.toFixed(2) + ', final:' + finalValue + ', step ' + this.incr);
    if ((this.incr > 0 && this.valueToDisplay.toFixed(2) >= finalValue) || (this.incr < 0 && this.valueToDisplay.toFixed(2) <= finalValue)) {
      if (canvasName === 'twdCanvas') {
        console.log('Stop, ' + finalValue + ' reached, steps were ' + this.incr);
        //  console.log('Stop!')
      }
      window.clearInterval(this.intervalID);
      this.intervalID = 0;
      this.previousValue = on360(finalValue);
      if (running) {
        instance.animate();
      } else {
        this.drawDisplay(canvasName, displaySize, finalValue); // Final state
      }
      this.busy = false; // Free!
    } else {
      window.setTimeout(function () { instance.displayAndIncrement(finalValue); }, 50);
    }
  };

  function getStyleRuleValue(style, selector, sheet) {
    let sheets = typeof sheet !== 'undefined' ? [sheet] : document.styleSheets;
    for (let i = 0, l = sheets.length; i < l; i++) {
      let sheet = sheets[i];
      try {
        if (sheet.cssRules) { 
          for (let j = 0, k = sheet.cssRules.length; j < k; j++) {
            let rule = sheet.cssRules[j];
            if (rule.selectorText && rule.selectorText.split(',').indexOf(selector) !== -1) {
              return rule.style[style];
            }
          }
        } else {
          continue;
        }
      } catch (error) {
        continue;
      }
    }
    return null;
  };

  this.drawDisplay = function(displayCanvasName, displayRadius, displayValue) {
    let schemeColor = getStyleRuleValue('color', '.display-scheme');
//  console.log(">>> DEBUG >>> color:" + schemeColor);
    if (schemeColor === 'black') {
      directionColorConfig = directionColorConfigBlack;
    } else if (schemeColor === 'white') {
      directionColorConfig = directionColorConfigWhite;
    }
    let digitColor = directionColorConfig.digitColor;
    
    let canvas = document.getElementById(displayCanvasName);
    let context = canvas.getContext('2d');

    let radius = displayRadius;
  
    // Cleanup
  //context.fillStyle = "#ffffff";
    context.fillStyle = directionColorConfig.bgColor;
//  context.fillStyle = "transparent";
    context.fillRect(0, 0, canvas.width, canvas.height);    
  //context.fillStyle = 'rgba(255, 255, 255, 0.0)';
  //context.fillRect(0, 0, canvas.width, canvas.height);    
  
    context.beginPath();
  //context.arc(x, y, radius, startAngle, startAngle + Math.PI, antiClockwise);      
    context.arc(canvas.width / 2, radius + 10, radius, 0, 2 * Math.PI, false);
    context.lineWidth = 5;
  
    if (directionColorConfig.withGradient) {
      let grd = context.createLinearGradient(0, 5, 0, radius);
      grd.addColorStop(0, directionColorConfig.displayBackgroundGradient.from);// 0  Beginning
      grd.addColorStop(1, directionColorConfig.displayBackgroundGradient.to);  // 1  End
      context.fillStyle = grd;
    } else {
      context.fillStyle = directionColorConfig.displayBackgroundGradient.to;
    }
    if (directionColorConfig.withDisplayShadow) {
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 3;
      context.shadowBlur  = 3;
      context.shadowColor = directionColorConfig.shadowColor;
    }
    context.lineJoin    = "round";
    context.fill();
    context.strokeStyle = directionColorConfig.outlineColor;
    context.stroke();
    context.closePath();
    
    // Major Ticks
    context.beginPath();
    for (i = 0;i < 360 ;i+=majorTicks) {
      xFrom = (canvas.width / 2) - ((radius * 0.95) * Math.cos(2 * Math.PI * (i / 360)));
      yFrom = (radius + 10) - ((radius * 0.95) * Math.sin(2 * Math.PI * (i / 360)));
      xTo = (canvas.width / 2) - ((radius * 0.85) * Math.cos(2 * Math.PI * (i / 360)));
      yTo = (radius + 10) - ((radius * 0.85) * Math.sin(2 * Math.PI * (i / 360)));
      context.moveTo(xFrom, yFrom);
      context.lineTo(xTo, yTo);
    }
    context.lineWidth = 3;
    context.strokeStyle = directionColorConfig.majorTickColor;
    context.stroke();
    context.closePath();
  
    // Minor Ticks
    if (minorTicks > 0) {
      context.beginPath();
      for (i = 0;i <= 360 ;i+=minorTicks) {
        xFrom = (canvas.width / 2) - ((radius * 0.95) * Math.cos(2 * Math.PI * (i / 360)));
        yFrom = (radius + 10) - ((radius * 0.95) * Math.sin(2 * Math.PI * (i / 360)));
        xTo = (canvas.width / 2) - ((radius * 0.90) * Math.cos(2 * Math.PI * (i / 360)));
        yTo = (radius + 10) - ((radius * 0.90) * Math.sin(2 * Math.PI * (i / 360)));
        context.moveTo(xFrom, yFrom);
        context.lineTo(xTo, yTo);
      }
      context.lineWidth = 1;
      context.strokeStyle = directionColorConfig.minorTickColor;
      context.stroke();
      context.closePath();
    }
    
    // Numbers
    context.beginPath();
    for (i = 0;i < 360 ;i+=majorTicks) {
      context.save();
      context.translate(canvas.width/2, (radius + 10)); // canvas.height);
      context.rotate((2 * Math.PI * (i / 360)));
      context.font = "bold " + Math.round(scale * 15) + "px Arial"; // Like "bold 15px Arial"
      context.fillStyle = digitColor;
      str = i.toString();
      len = context.measureText(str).width;
      context.fillText(str, - len / 2, (-(radius * .8) + 10));
      context.lineWidth = 1;
      context.strokeStyle = directionColorConfig.valueOutlineColor;
      context.strokeText(str, - len / 2, (-(radius * .8) + 10)); // Outlined  
      context.restore();
    }
    context.closePath();
    // Value
    let dv = displayValue;
    while (dv > 360) dv -= 360;
    while (dv < 0) dv += 360;
    text = dv.toFixed(directionColorConfig.valueNbDecimal);
    len = 0;
    context.font = "bold " + Math.round(scale * 40) + "px " + directionColorConfig.font; // "bold 40px Arial"
    let metrics = context.measureText(text);
    len = metrics.width;
  
    context.beginPath();
    context.fillStyle = directionColorConfig.valueColor;
    context.fillText(text, (canvas.width / 2) - (len / 2), ((radius * .75) + 10));
    context.lineWidth = 1;
    context.strokeStyle = directionColorConfig.valueOutlineColor;
    context.strokeText(text, (canvas.width / 2) - (len / 2), ((radius * .75) + 10)); // Outlined  
    context.closePath();
  
    // Hand
    context.beginPath();
    if (directionColorConfig.withHandShadow) {
      context.shadowColor = directionColorConfig.shadowColor;
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 3;
      context.shadowBlur = 3;
    }
    // Center
    context.moveTo(canvas.width / 2, radius + 10);
    // Left
    x = (canvas.width / 2) - ((radius * 0.05) * Math.cos((2 * Math.PI * (displayValue / 360)))); //  - (Math.PI / 2))));
    y = (radius + 10) - ((radius * 0.05) * Math.sin((2 * Math.PI * (displayValue / 360)))); // - (Math.PI / 2))));
    context.lineTo(x, y);
    // Tip
    x = (canvas.width / 2) - ((radius * 0.90) * Math.cos(2 * Math.PI * (displayValue / 360) + (Math.PI / 2)));
    y = (radius + 10) - ((radius * 0.90) * Math.sin(2 * Math.PI * (displayValue / 360) + (Math.PI / 2)));
    context.lineTo(x, y);
    // Right
    x = (canvas.width / 2) - ((radius * 0.05) * Math.cos((2 * Math.PI * (displayValue / 360) + (2 * Math.PI / 2))));
    y = (radius + 10) - ((radius * 0.05) * Math.sin((2 * Math.PI * (displayValue / 360) + (2 * Math.PI / 2))));
    context.lineTo(x, y);
  
    context.closePath();
    context.fillStyle = directionColorConfig.handColor;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = directionColorConfig.handOutlineColor;
    context.stroke();
    // Knob
    context.beginPath();
    context.arc((canvas.width / 2), (radius + 10), 7, 0, 2 * Math.PI, false);
    context.closePath();
    context.fillStyle = directionColorConfig.knobColor;
    context.fill();
    context.strokeStyle = directionColorConfig.knobOutlineColor;
    context.stroke();
  };
  
  this.setValue = function(val) {
    instance.drawDisplay(canvasName, displaySize, val);
  };

  (function() { instance.drawDisplay(canvasName, displaySize, instance.previousValue); })(); // Invoked automatically
}
