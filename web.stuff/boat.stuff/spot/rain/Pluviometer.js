/*
 * @author Olivier Le Diouris
 * 
 * This is NOT a WebComponent
 */
const pluviometerColorConfigWhite = {
  withShadow:        true,
  shadowColor:       'LightGrey',
  scaleColor:        'black',
  bgColor:           'white',
  majorTickColor:    'LightGrey',
  minorTickColor:    'DarkGrey',
  valueOutlineColor: 'black',
  valueColor:        'DarkGrey',
  tubeOutlineColor:  'pink',
  hgOutlineColor:    'DarkGrey',
  font:              'Arial'
};

const pluviometerColorConfigBlack = {
  withShadow:        true,
  shadowColor:       'black',
  scaleColor:        'LightGrey',
  bgColor:           'black',
  majorTickColor:    'LightGrey',
  minorTickColor:    'DarkGrey',
  valueOutlineColor: 'black',
  valueColor:        'LightGrey',
  tubeOutlineColor:  'pink',
  hgOutlineColor:    'DarkGrey',
  font:              'Arial'
};

let pluviometerColorConfig = pluviometerColorConfigWhite; // White is the default

function Pluviometer(cName, minValue, maxValue, majorTicks, minorTicks) {
  if (minValue === undefined) {
    minValue = 0;
  }
  if (maxValue === undefined) {
    maxValue = 5; //20;
  }
  if (majorTicks === undefined) {
    majorTicks = 1;
  }
  if (minorTicks === undefined) {
    minorTicks = 0.25;
  }

  let canvasName = cName;

  let running = false;
  let previousValue = 0.0;
  let intervalID;
  let valueToDisplay = 0;
  
  let instance = this;
  
//try { console.log('in the pluviometer constructor for ' + cName + " (" + dSize + ")"); } catch (e) {}
  
  (function(){ drawDisplay(canvasName, previousValue); })(); // Invoked automatically
  
  this.repaint = function() {
    drawDisplay(canvasName, previousValue);
  };
  
  this.startStop = function (buttonName) {
//  console.log('StartStop requested on ' + buttonName);
    let button = document.getElementById(buttonName);
    running = !running;
    button.value = (running ? "Stop" : "Start");
    if (running) {
      this.animate();
    } else {
      window.clearInterval(intervalID);
      previousValue = valueToDisplay;
    }
  };

  this.animate = function() {    
    let value;
    if (arguments.length === 1) {
      value = arguments[0];
    } else {
//    console.log("Generating random value");
      value = minValue + ((maxValue - minValue) * Math.random());
    }
//  console.log("Reaching Value :" + value + " from " + previousValue);
    diff = value - previousValue;
    valueToDisplay = previousValue;
    
//  console.log(canvasName + " going from " + previousValue + " to " + value);
    
    if (diff > 0) {
      incr = 1; // 0.1 * maxValue; // 0.01 is nicer, but too slow...
    } else {
      incr = -1; // -0.1 * maxValue;
    }
    intervalID = window.setInterval(function () { displayAndIncrement(incr, value); }, 50);
  };

  function displayAndIncrement(inc, finalValue) {
    //console.log('Tic ' + inc + ', ' + finalValue);
    drawDisplay(canvasName, valueToDisplay);
    valueToDisplay += inc;
    if ((inc > 0 && valueToDisplay > finalValue) || (inc < 0 && valueToDisplay < finalValue)) {
      //  console.log('Stop!')
      window.clearInterval(intervalID);
      previousValue = finalValue;
      if (running) {
        instance.animate();
      } else {
        drawDisplay(canvasName, finalValue);
      }
    }
  };

  function drawDisplay(displayCanvasName, displayValue) {
    let schemeColor; 
    try { schemeColor = getCSSClass(".display-scheme"); } catch (err) {}
    if (schemeColor !== undefined && schemeColor !== null) {
      let styleElements = schemeColor.split(";");
      for (let i=0; i<styleElements.length; i++) {
        let nv = styleElements[i].split(":");
        if ("color" === nv[0]) {
//        console.log("Scheme Color:[" + nv[1].trim() + "]");
          if (nv[1].trim() === 'black') {
            pluviometerColorConfig = pluviometerColorConfigBlack;
          } else if (nv[1].trim() === 'white') {
            pluviometerColorConfig = pluviometerColorConfigWhite;
          }
        }
      }
    }

    let digitColor = pluviometerColorConfig.scaleColor;
    
    let canvas = document.getElementById(displayCanvasName);
    let context = canvas.getContext('2d');

    // Cleanup
    context.fillStyle = pluviometerColorConfig.bgColor;
  //context.fillStyle = "#ffffff";
  //context.fillStyle = "LightBlue";
  //context.fillStyle = "transparent";
    context.fillRect(0, 0, canvas.width, canvas.height);    
  //context.fillStyle = 'rgba(255, 255, 255, 0.0)';
  //context.fillRect(0, 0, canvas.width, canvas.height);    
  
  //context.fillStyle = "transparent";
     // Bottom of the tube at (canvas.height - 10)
    let bottomTube = (canvas.height - 10);
    let topTube = 20;// Top of the tube at y = 20
    
    let tubeLength = bottomTube - topTube;
    let tubeWidth  = tubeLength / 5;
    let xFrom, xTo, yFrom, yTo;

    // Tube
    context.beginPath();
  //context.arc(x, y, radius, startAngle, startAngle + Math.PI, antiClockwise);          
    let x = (canvas.width / 2) - (1.5 * (tubeWidth / 2));
    let y = bottomTube;
    context.moveTo(x, y);    // bottom left
    x = (canvas.width / 2) + (1.5 * (tubeWidth / 2));
    context.lineTo(x, y); // bottom right
    x = (canvas.width / 2) + (tubeWidth / 2);
    y = bottomTube - 5; 
    context.lineTo(x, y); // Right, just above the foot
    y = topTube;
    context.lineTo(x, y); // Top right
    x = (canvas.width / 2) - (1.5 * (tubeWidth / 2));
    context.lineTo(x, y); // Top left, with the bill
    y = topTube + 10;
    x = (canvas.width / 2) - (tubeWidth / 2);
    context.lineTo(x, y); // Left, under the bill
    y = bottomTube - 5; 
    context.lineTo(x, y); // Left, just above the foot
    x = (canvas.width / 2) - (1.5 * (tubeWidth / 2));
    y = bottomTube;
    context.lineTo(x, y); // Back to base

    context.lineWidth = 1;
    context.stroke();
  
    let grd = context.createLinearGradient(0, 5, 0, tubeLength);
    grd.addColorStop(0, 'LightGrey'); // 0  Beginning. black
    grd.addColorStop(1, 'white');     // 1  End. LightGrey
    context.fillStyle = grd;

    if (pluviometerColorConfig.withShadow) {    
      context.shadowOffsetX = 3;
      context.shadowOffsetY = 3;
      context.shadowBlur  = 3;
      context.shadowColor = pluviometerColorConfig.shadowColor;
    }
  
    context.lineJoin    = "round";
    context.fill();
    context.strokeStyle = pluviometerColorConfig.tubeOutlineColor; // Tube outline color
    context.stroke();
    context.closePath();
        
    bottomTube -= 5;
    topTube -= 5;
    tubeLength -= 10;    

    // Liquid in the tube
    let dv = Math.min(displayValue, maxValue);
    context.beginPath();
    x = (canvas.width / 2) - (0.9 * (tubeWidth / 2));
    y = bottomTube;
    context.moveTo(x, y);   // bottom left
    x = (canvas.width / 2) + (0.9 * (tubeWidth / 2));
    context.lineTo(x, y);   // bottom right
    y = bottomTube - ((tubeLength) * (dv / (maxValue - minValue)));
    context.lineTo(x, y);   // top right
    x = (canvas.width / 2) - (0.9 * (tubeWidth / 2));
    context.lineTo(x, y);   // top left

    context.lineWidth = 1;
  
    let _grd = context.createLinearGradient(0, topTube, 0, tubeLength);
    // Colors are hard-coded
    _grd.addColorStop(0,   'navy');   // 0  Beginning, top
    _grd.addColorStop(0.5, 'blue');
    _grd.addColorStop(1,   'cyan');   // 1  End, bottom
    context.fillStyle = _grd;
    
//  context.shadowBlur  = 20;
//  context.shadowColor = 'black';
  
    context.lineJoin    = "round";
    context.fill();
    context.strokeStyle = pluviometerColorConfig.hgOutlineColor;
    context.stroke();
    context.closePath();

    // Major Ticks
    context.beginPath();
    for (i = 0;i <= (maxValue - minValue) ;i+=majorTicks) {
      xFrom = (canvas.width / 2) + (tubeWidth / 2);
      yFrom = bottomTube - ((tubeLength) * (i / (maxValue - minValue)));
      xTo = xFrom - 20;
      yTo = yFrom;
      context.moveTo(xFrom, yFrom);
      context.lineTo(xTo, yTo);
    }
    context.lineWidth = 1;
    context.strokeStyle = pluviometerColorConfig.majorTickColor;
    context.stroke();
    context.closePath();

    // Minor Ticks
    if (minorTicks > 0) {
      context.beginPath();
      for (i = 0;i <= (maxValue - minValue) ;i+=minorTicks) {
        xFrom = (canvas.width / 2) + (tubeWidth / 2);
        yFrom = bottomTube - ((tubeLength) * (i / (maxValue - minValue)));
        xTo = xFrom - 10;
        yTo = yFrom;
        context.moveTo(xFrom, yFrom);
        context.lineTo(xTo, yTo);
      }
      context.lineWidth = 1;
      context.strokeStyle = pluviometerColorConfig.minorTickColor;
      context.stroke();
      context.closePath();
    }
    
    // Numbers
    context.beginPath();
    for (i = minValue;i <= maxValue ;i+=majorTicks) {
      xTo = (canvas.width / 2) + 20;
      yTo = bottomTube - ((tubeLength) * ((i - minValue) / (maxValue - minValue)));;
      context.font = "bold 10px " + pluviometerColorConfig.font;
      context.fillStyle = digitColor;
      str = i.toString();
      len = context.measureText(str).width;
      context.fillText(str, xTo, yTo + 3); // 5: half font size
    }
    context.closePath();
    
    // Value
//  displayValue = 5.3; // for tests
    text = displayValue.toFixed(2);
    len = 0;
    context.font = "bold 12px " + pluviometerColorConfig.font;
    let metrics = context.measureText(text);
    len = metrics.width;
  
    context.beginPath();
    context.fillStyle = pluviometerColorConfig.valueColor;
    context.fillText(text, (canvas.width / 2) - (len / 2), 10);
    context.lineWidth = 1;
    context.strokeStyle = pluviometerColorConfig.valueOutlineColor;
    context.strokeText(text, (canvas.width / 2) - (len / 2), 10); // Outlined  
    context.closePath();
  };
  
  this.setValue = function(val) {
    drawDisplay(canvasName, val);
  };
}