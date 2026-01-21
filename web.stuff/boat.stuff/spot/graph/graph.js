function Graph(cName,       // Canvas Name
               cWidth,      // Canvas width
               cHeight,     // Canvas height
               graphData,   // x,y tuple array
               xLabels,     // array of labels, for abscisses
               yLabels)     // array of labels, for ordinates
{
  let instance = this;
  let xScale, yScale;
  let minx, miny, maxx, maxy;
  let context;

  this.doOnClick = function(idx) { // Default
    console.log("Clicked on index: " + idx);
  }

  let onClick = function(evt) {
    let coords = relativeMouseCoords(evt, canvas);
    let x = coords.x;
    let y = coords.y;
    // console.log("Click: x=" + x + ", y=" + y);
    let idx = Math.round(x / xScale);
    return idx;
  }

  let onclickCallback = function(evt) {
    let idx = onClick(evt);
    instance.doOnClick(idx);
  }

  let canvas = document.getElementById(cName);
  canvas.addEventListener('mousemove', (evt) => {
    if (document.getElementById("tooltip").checked) {
      let x = evt.pageX - canvas.offsetLeft;
      let y = evt.pageY - canvas.offsetTop;

      let coords = relativeMouseCoords(evt, canvas);
      x = coords.x;
      y = coords.y;
//    console.log("Mouse: x=" + x + ", y=" + y);

      let idx = Math.round(x / xScale) + 1;
      if (idx < SpotParser.nmeaData.length) {
        let str0;
        let str1; // = 'X : ' + x + ', ' + 'Y :' + y;
        let str2, str3, str4;
        try {
          str0 = `Record #${idx}`;
          str1 = SpotParser.nmeaData[idx].getNMEATws() + "kt @ " + SpotParser.nmeaData[idx].getNMEATwd() + "\xB0";
          if (document.getElementById("utc-display").checked) {
            str2 = SpotParser.nmeaData[idx].getNMEADate() + " UT";
          } else {
            str2 = reformatDate(SpotParser.nmeaData[idx].getNMEADate(), "d-M H:i");
          }
          str3 = SpotParser.nmeaData[idx].getNMEARain() + "mm";
          str4 = SpotParser.nmeaData[idx].getNMEAPrmsl() + "hPa";
  //      console.log("Bubble:" + str);
        } catch (err) {
          console.log(JSON.stringify(err));
        }

  //    context.fillStyle = '#000';
  //    context.fillRect(0, 0, w, h);
        instance.drawGraph(cName, graphData);
        instance.drawWind(SpotParser.nmeaData);
        context.fillStyle = "rgba(250, 250, 210, .7)";
        // context.fillStyle = 'yellow';
        context.fillRect(x + 10, y + 10, 70, 30); // Background
        context.fillStyle = 'black';
        context.font = 'bold 12px verdana';

        let xPos = x;
        let yPos = y;
        if (x > (cWidth - 60)) {
          xPos = x - 80;
        }
        if (y > (cHeight - 40)) {
          yPos = y - 60;
        }
        context.fillText(str0, xPos + 15, yPos + 25, 60);
        // context.fillText(str1, x + 15, y + 25, 60);
        // context.fillText(str2, x + 15, y + 37, 60);
        context.fillText(str1, xPos + 15, yPos + 37, 60);
        context.fillText(str2, xPos + 15, yPos + 49, 60);
        context.fillText(str3, xPos + 15, yPos + 61, 60);
        context.fillText(str4, xPos + 15, yPos + 73, 60);
      }
    }
  }, 0);


  canvas.addEventListener('click', onclickCallback, false);

  function relativeMouseCoords(event, element) {
    let totalOffsetX = 0;
    let totalOffsetY = 0;
    let canvasX = 0;
    let canvasY = 0;
    let currentElement = element;

    do {
      totalOffsetX += currentElement.offsetLeft - currentElement.scrollLeft;
      totalOffsetY += currentElement.offsetTop - currentElement.scrollTop;
    } while (currentElement = currentElement.offsetParent);

    canvasX = event.pageX - totalOffsetX;
    canvasY = event.pageY - totalOffsetY;

    return {x:canvasX, y:canvasY};
  }

  this.minX = function(data) {
    let min = Number.MAX_VALUE;
    for (let i=0; i<data.length; i++) {
      min = Math.min(min, data[i].getX());
    }
    return min;
  };

  this.minY = function(data) {
    let min = Number.MAX_VALUE;
    for (let i=0; i<data.length; i++) {
      min = Math.min(min, data[i].getY());
    }
    return min;
  };

  this.maxX = function(data) {
    let max = Number.MIN_VALUE;
    for (let i=0; i<data.length; i++) {
      max = Math.max(max, data[i].getX());
    }
    return max;
  };

  this.maxY = function(data) {
    let max = Number.MIN_VALUE;
    for (let i=0; i<data.length; i++) {
      max = Math.max(max, data[i].getY());
    }
    return max;
  };

  this.drawGraph = function(displayCanvasName, data, idx) {
    context = canvas.getContext('2d');

    let _idxX;
    if (idx !== undefined) {
      _idxX = idx * xScale;
    }

    let mini = Math.floor(this.minY(data));
    let maxi = Math.ceil(this.maxY(data));
    let gridXStep = Math.round((maxi - mini) / 3);
    let gridYStep = Math.round(SpotParser.nmeaData.length / 10);

    // Sort the tuples (on X)
    data.sort(sortTupleX);

    let smoothData = [];
    // 1 - More data (10 times more)
    for (let i=0; i<data.length - 1; i++) {
      for (let j=0; j<10; j++) {
        let _x = data[i].getX() + (j * (data[i + 1].getX() - data[i].getX()) / 10);
        let _y = data[i].getY() + (j * (data[i + 1].getY() - data[i].getY()) / 10);
        smoothData.push(new Tuple(_x, _y));
      }
    }
    // 2 - Smooth
    let _smoothData = [];
    let smoothWidth = 20;
    for (let i=0; i<smoothData.length; i++) {
      let yAccu = 0;
      for (let acc=i-(smoothWidth / 2); acc<i+(smoothWidth/2); acc++) {
        let y;
        if (acc < 0) {
          y = smoothData[0].getY();
        } else if (acc > (smoothData.length - 1)) {
          y = smoothData[smoothData.length - 1].getY();
        } else {
          y = smoothData[acc].getY();
        }
        yAccu += y;
      }
      yAccu = yAccu / smoothWidth;
      _smoothData.push(new Tuple(smoothData[i].getX(), yAccu));
//    console.log("I:" + smoothData[i].getX() + " y from " + smoothData[i].getY() + " becomes " + yAccu);
    }
    smoothData = _smoothData;

    context.fillStyle = "LightYellow"; // "LightGray";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Horizontal grid (TWS)
    for (let i=Math.round(mini); i<maxi; i+=gridXStep) {
      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = 'gray';
      context.moveTo(0, cHeight - (i - mini) * yScale);
      context.lineTo(cWidth, cHeight - (i - mini) * yScale);
      context.stroke();

      context.save();
      context.font = "bold 10px Arial";
      context.fillStyle = 'black';
      str = i.toString() + " kt";
      len = context.measureText(str).width;
      context.fillText(str, cWidth - (len + 2), cHeight - ((i - mini) * yScale) - 2);
      context.restore();
      context.closePath();
    }

    // Vertical grid (Time)
    for (let i=gridYStep; i<data.length; i+=gridYStep) {
      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = 'gray';
      context.moveTo(i * xScale, 0);
      context.lineTo(i * xScale, cHeight);
      context.stroke();

      // Rotate the whole context, and then write on it (that's why we need the translate)
      context.save();
      context.translate(i * xScale, canvas.height);
      context.rotate(-Math.PI / 2);
      context.font = "bold 10px Arial";
      context.fillStyle = 'black';
      if (document.getElementById("utc-display").checked) {
        str = SpotParser.nmeaData[i].getNMEADate() + " UT";
      } else {
        str = reformatDate(SpotParser.nmeaData[i].getNMEADate(), "D d-M H:i");
      }
      len = context.measureText(str).width;
      context.fillText(str, 2, -1); //i * xScale, cHeight - (len));
      context.restore();
      context.closePath();
    }

    if (document.getElementById("raw-data").checked) { // Raw data
      context.beginPath();
      context.lineWidth = 1;
      context.strokeStyle = 'green';

      let previousPoint = data[0];
      for (let i=1; i<data.length; i++) {
        context.moveTo((previousPoint.getX() - minx) * xScale, cHeight - (previousPoint.getY() - miny) * yScale);
        context.lineTo((data[i].getX() - minx) * xScale, cHeight - (data[i].getY() - miny) * yScale);
        context.stroke();
        previousPoint = data[i];
      }
      context.closePath();
    }

    if (document.getElementById("smooth-data").checked) { // Smoothed data
      data = smoothData;

      context.beginPath();
      context.lineWidth = 3;
      context.strokeStyle = 'red';

      previousPoint = data[0];
      for (let i=1; i<data.length; i++) {
        context.moveTo((previousPoint.getX() - minx) * xScale, cHeight - (previousPoint.getY() - miny) * yScale);
        context.lineTo((data[i].getX() - minx) * xScale, cHeight - (data[i].getY() - miny) * yScale);
        context.stroke();
        previousPoint = data[i];
      }
      context.closePath();
    }

    if (idx !== undefined) {
      context.beginPath();
      context.lineWidth = 3;
      context.strokeStyle = 'rgba(0, 200, 0, 0.75)'; // 'green';
      context.moveTo(_idxX, 0);
      context.lineTo(_idxX, cHeight);
      context.stroke();
      context.closePath();
    }
  };

  const ARROW_LEN = 20;
  const ADD_180_DEGREES = false;

  this.drawWind = function(nmea) {
    for (let i=0; i<nmea.length; i++) {
      let wd = parseFloat(nmea[i].getNMEATwd()) + (ADD_180_DEGREES ? 180 : 0); // 180: Direction the wind is blowing TO
      while (wd > 360) {
        wd -= 360;
      }
      let twd = toRadians(wd);
      context.beginPath();
      let x = i * (cWidth / nmea.length);
      let y = cHeight / 2;
      let dX = ARROW_LEN * Math.sin(twd);
      let dY = - ARROW_LEN * Math.cos(twd);
      // create a new line object
      let line = new Line(x, y, x + dX, y + dY);
      // draw the line
      // console.log(`WindSpeed: ${nmea[i].getNMEATws()}`);
      line.drawWindArrow(context, wd, parseFloat(nmea[i].getNMEATws()) /* + 50 */, false);
      context.closePath();
    }
  };

  (function() {
     minx = instance.minX(graphData);
     miny = instance.minY(graphData);
     maxx = instance.maxX(graphData);
     maxy = instance.maxY(graphData);

//   console.log("MinX:" + minx + ", MaxX:" + maxx + ", MinY:" + miny + ", MaxY:" + maxy);

     xScale = cWidth / (maxx - minx);
     yScale = cHeight / (maxy - miny);

//   console.log("xScale:" + xScale + ", yScale:" + yScale);

     instance.drawGraph(cName, graphData);
   })(); // Invoked automatically when new is invoked.
};

function Tuple(_x, _y) {
  let x = _x;
  let y = _y;

  this.getX = function() { return x; };
  this.getY = function() { return y; };
};

function sortTupleX(t1, t2) {
  if (t1.getX() < t2.getX()) {
    return -1;
  }
  if (t1.getX() > t2.getX()) {
    return 1;
  }
  return 0;
};
