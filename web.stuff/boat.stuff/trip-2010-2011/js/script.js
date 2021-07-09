/**
 * Copyright and left, tamere
 * 
 * Good SVG/Bezier paper at https://www.drububu.com/animation/beziercurves/index.html
 */
const DEBUG = false;

const oneDay = 1000 * 60 * 60 * 24; // im ms.
let startDate = setDate(2010, 10, 2);

let nbAnchors = 0;

function displayDate(year, month, day, lng) {
  document.write(formatDateHeader(year, month, day, lng));
}

let weekDaysEN = [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ];
let weekDaysFR = [ "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" ];

let monthEN    = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
let monthFR    = [ "janvier", "f&eacute;vrier", "mars", "avril", "mai", "juin", "juillet", "ao&ucirc;t", "septembre", "octobre", "novembre", "d&eacute;cembre" ];

function formatDateHeader(year, month, day, lng) {
  let currentDate = setDate(year, month, day);
  let str = "<div><h4><a name='" + formatDateAnchor(nbAnchors) + "' style='padding-top: 20px;'>";
  str = str + formatDate(currentDate, lng) + "&nbsp;&nbsp<small>(" + (lng=="EN"?"day":"jour") + " " + (diffDateInDays(startDate, currentDate) + 1) + ")</small>";
  str = str + "</a>" + "&nbsp;&nbsp;&nbsp;";
  if (!getPrint()) {
    if (nbAnchors > 0) {
      str = str + "<a href='#" + formatDateAnchor(nbAnchors - 1) + "'><img src='previous.png' border='0' alt='" + previous(lng) + "' title='" + previous(lng) + "'></a>&nbsp;";
    }
    str = str + "<a href='#" + formatDateAnchor(nbAnchors + 1) + "'><img src='next.png' border='0' alt='" + next(lng) + "' title='" + next(lng) + "'></a>" + "</h4>";
  }
  nbAnchors++;
  str += "</div>";
  return str;
}

function previous(lng) {
  let str = "previous";
  if (lng === "FR") {
    str = "pr&eacute;c&eacute;dent";
  }
  return str;
}

function next(lng) {
  let str = "next";
  if (lng === "FR") {
    str = "suivant";
  }
  return str;
}

function formatDateAnchor(idx) {
  return "DateAnchor-" + lpad(idx, "0", 4);
}

function lpad(i, padStr, len) {
  let s = i.toString();
  while (s.length < len) {
    s = padStr + s;
  }
  return s;
}

function setDate(year, month, day) {
  let date = new Date();
  date.setFullYear(year, month - 1, day);
  return date;
}

function formatDate(date, lng) {
  let dayInMonth = date.getDate();   // 1-31
  let dayOfWeek  = date.getDay();    // 0-6
  let month      = date.getMonth();  // 0-11
  let year       = date.getFullYear();
  
  let formattedDate = "";
  if (lng === "EN") {
    formattedDate = weekDaysEN[dayOfWeek] + ", " + monthEN[month] + " " + dayInMonth + ", " + year;
  } else if (lng === "FR") {
    formattedDate = weekDaysFR[dayOfWeek] + " " + dayInMonth + " " + monthFR[month] + " " + year;
  }
  return formattedDate;
}	

function diffDateInDays(dateFrom, dateTo) {
  let diff = (dateTo.getTime() - dateFrom.getTime()) / oneDay;
  return Math.floor(diff);
}

function getPrint() {
  let loc = document.location.toString();
  let i = loc.indexOf("?print");
  let print = false;
  if (i > -1) {
    print = true;
  }
  return print;
}

const NONE           = 0;
const YANKEE         = 1;
const GENOA          = 2;
const STAYSAIL       = 3;
const FULL           = 4;
const ONE_REEF       = 5;
const TWO_REEF       = 6;
const WRAPPED_GENOA  = 7;
const STORM_STAYSAIL = 8;

const EN = "EN";
const FR = "FR";

function sailTag(text, nodeName, jib, ss, main, mizzen, mss, spi) {
  if (!getPrint()) {
    mess = '<a href="" style="background-color:yellow; text-decoration:none" onClick="javascript:return false;" ';
	  mess += 'onMouseOver="javascript:sails(\'' + nodeName + '\', ' + jib + ', ' + ss + ', ' + main + ', ' + mizzen + ', ' + mss + ', ' + spi + ');" ';
	  mess += 'onMouseOut="javascript:reset(\'' + nodeName + '\');">' + text + '</a>';
//  alert(mess);
	  document.write(mess);
  } else {
    document.write(text);
	// FIXME
 // sails(nodeName, jib, ss, main, mizzen, mss, spi);
  }
}

function sails(nodeName, jib, ss, main, mizzen, mss, spi) {
  let imgName = "CheoyLee42.";
  if (mss === undefined) {
    mss = NONE;
  }
  if (spi === undefined) {
    spi = NONE;
  }
  
//alert("Jib=" + jib + "\nSS=" + ss + "\nmain=" + main + "\nmizzen=" + mizzen + "\nmss=" + mss + "\nspi=" + spi);
  
  if (jib === YANKEE && ss === STAYSAIL && main === FULL && mizzen === FULL && mss === NONE && spi === NONE) {
    imgName += "yankee.staysail.main.mizzen.png";
  }
  if (jib === GENOA && ss === NONE && main === FULL && mizzen === FULL && mss === NONE && spi === NONE) {
    imgName += "genoa.main.mizzen.png";
  }
  if (jib === YANKEE && ss === STAYSAIL && main === FULL && mizzen === NONE && mss === NONE && spi === NONE) {
    imgName += "yankee.staysail.main.full.png";
  }
  if (jib === YANKEE && ss === STAYSAIL && main === ONE_REEF && mizzen === NONE && mss === NONE && spi === NONE) {
    imgName += "yankee.staysail.main.one.reef.png";
  }
  if (jib === YANKEE && ss === STAYSAIL && main === TWO_REEF && mizzen === NONE && mss === NONE && spi === NONE) {
    imgName += "yankee.staysail.main.two.reefs.png";
  }
  if (jib === NONE && ss === STAYSAIL && main === TWO_REEF && mizzen === NONE && mss === NONE && spi === NONE) {
    imgName += "staysail.main.two.reefs.png";
  }
  if (jib === YANKEE && ss === STAYSAIL && main === TWO_REEF && mizzen === FULL && mss === NONE && spi === NONE) {
    imgName += "yankee.staysail.main.two.reefs.full.mizzen.png";
  }
  if (jib === YANKEE && ss === STAYSAIL && main === NONE && mizzen === FULL && mss === NONE && spi === NONE) {
    imgName += "yankee.staysail.mizzen.full.png";
  }
  if (jib === YANKEE && ss === STAYSAIL && main === TWO_REEF && mizzen === ONE_REEF && mss === NONE && spi === NONE) {
    imgName += "yankee.staysail.main.two.reefs.mizzen.one.reef.png";
  }
  if (jib === YANKEE && ss === STAYSAIL && main === NONE && mizzen === NONE && mss === NONE && spi === NONE) {
    imgName += "yankee.staysail.png";
  }
  if (mss === FULL && jib === YANKEE && ss === STAYSAIL && main === FULL && mizzen === NONE  && spi === NONE) {
    imgName += "yankee.staysail.main.mss.png";
  }
  if (mss === FULL && jib === YANKEE && ss === STAYSAIL && main === FULL && mizzen === FULL  && spi === NONE) {
    imgName += "yankee.staysail.main.mss.mizzen.png";
  }
  if (mss === NONE && jib === NONE && ss === NONE && main === FULL && mizzen === FULL && spi === FULL) {
    imgName += "main.mizzen.spi.png";
  }
  if (jib === WRAPPED_GENOA && ss === NONE && main === TWO_REEF && mizzen === NONE && mss === NONE && spi === NONE) {
    imgName += "wrapped_genoa.main.two.reefs.png";
  }
  if (jib === WRAPPED_GENOA && ss === NONE && main === NONE && mizzen === FULL && mss === NONE && spi === NONE) {
    imgName += "wrapped_genoa.mizzen.png";
  }
  if (jib === WRAPPED_GENOA && ss === NONE && main === NONE && mizzen === ONE_REEF && mss === NONE && spi === NONE) {
	   imgName += "wrapped_genoa.mizzen.one.reef.png";
  }
  if (jib === WRAPPED_GENOA && ss === NONE && main === TWO_REEF && mizzen === ONE_REEF && mss === NONE && spi === NONE) {
  	imgName += "wrapped_genoa.main.two.reefs.mizzen.one.reef.png";
  }
  if (jib === YANKEE && ss === NONE && main === TWO_REEF && mizzen === NONE && mss === NONE && spi === NONE) {
  	imgName += "yankee.main.two.reefs.png";
  }
  if (jib === NONE && ss === STORM_STAYSAIL && main === TWO_REEF && mizzen === NONE && mss === NONE && spi === NONE) {
  	imgName += "main.two.reefs.storm.staysail.png";
  }
  if (jib === NONE && ss === STAYSAIL && main === FULL && mizzen === NONE && mss === NONE && spi === NONE) {
  	imgName += "main.staysail.png";
  }
  if (jib === NONE && ss === STAYSAIL && main === ONE_REEF && mizzen === NONE && mss === NONE && spi === NONE) {
  	imgName += "staysail.main.one.reef.png";	
  }
  if (jib === YANKEE && ss === STAYSAIL && main === ONE_REEF && mizzen === FULL && mss === NONE && spi === NONE) {
  	imgName += "yankee.staysail.main.one.reef.mizzen.png";
  }
  if (jib === NONE && ss === STAYSAIL && main === NONE && mizzen === NONE && mss === NONE && spi === NONE) {
  	imgName += "staysail.png";
  }
  if (jib === NONE && ss === NONE && main === NONE && mizzen === NONE && mss === NONE && spi === NONE) {
  	imgName += "bare.pole.png";
  }
		
  try { 
    let elmt = document.getElementById(nodeName);
    let txt = document.createTextNode(elmt); 
    elmt.innerHTML = "<img src='sails/" + imgName + "' width='171' height='169' align='left' valign='top' alt='" + imgName + "' title='" + imgName + "'>"; 
  } catch (ex) { 
    alert("Exception! " + ex.toString()); 
  } 
}

function stripTag(text, nodeName) {
  if (!getPrint()) {
    mess = '<a href="" style="background-color: gray; text-decoration: none;" onClick="javascript:return false;" ';
	  mess += 'onMouseOver="javascript:strip(\'' + nodeName + '\');" ';
	  mess += 'onMouseOut="javascript:reset(\'' + nodeName + '\');">' + text + '</a>';
//  alert(mess);
	  document.write(mess);
  } else {
    document.write(text);
  }
}

function strip(nodeName) {
  let imgName = "filmstrip.png";
  try { 
    let elmt = document.getElementById(nodeName); //    
    let txt = document.createTextNode(elmt); 
    elmt.innerHTML = "<img src='" + imgName + "' align='left' valign='top' width='203' height='8' alt='" + imgName + "' title='" + imgName + "'>"; 
  } catch (ex) { 
    alert("Exception! " + ex.toString()); 
  } 
}

function reset(nodeName) { 
  try { 
    let elmt = document.getElementById(nodeName); //    
    let txt = document.createTextNode(elmt); 
    elmt.innerHTML = ""; 
  } catch (ex) { 
    alert("Exception! " + ex.toString()); 
  } 
}

// LeafLet utilities
if (Math.toRadians === undefined) {
  Math.toRadians = deg => {
    return (deg / 180) * Math.PI;
  };
}

// Special characters, see https://www.toptal.com/designers/htmlarrows/numbers/fraction-one-quarter/
const NORTH = { value: 0, label: "N" };
const NORTH_1_4_NORTH_EAST = { value: 11.25, label: "N\u00BCNE" };
const NORTH_NORTH_EAST = { value: 22.5, label: "NNE" };
const NORTH_EAST_1_4_NORTH = { value: 33.75, label: "N\u00BCNE" };
const NORTH_EAST = { value: 45, label: "NE" };
const NORTH_EAST_1_4_EAST = { value: 56.25, label: "NE\u00BCE" };
const EAST_NORTH_EAST = { value: 67.5, label: "ENE" };
const EAST_1_4_NORTH_EAST = { value: 78.75, label: "E\u00BCNE" };
const EAST = { value: 90, label: "E" };
const EAST_1_4_SOUTH_EAST = { value: 101.25, label: "E\u00BCSE" };
const EAST_SOUTH_EAST = { value: 112.50, label: "ESE" };
const SOUTH_EAST_1_4_EAST = { value: 123.75, label: "SE\u00BCE" };
const SOUTH_EAST = { value: 135, label: "SE" };
const SOUTH_EAST_1_4_SOUTH = { value: 146.25, label: "SE\u00BCS" };
const SOUTH_SOUTH_EAST = { value: 157.50, label: "SSE" };
const SOUTH_1_4_SOUTH_EAST = { value: 168.75, label: "S\u00BCSE" };
const SOUTH = {value: 180, label: "S"};
const SOUTH_1_4_SOUTH_WEST = {value: 191.25, label: "S\u00BCSW"};
const SOUTH_SOUTH_WEST = {value: 202.50, label: "SSW"};
const SOUTH_WEST_1_4_SOUTH = {value: 213.75, label: "SW\u00BCS"};
const SOUTH_WEST = {value: 225, label: "SW"};
const SOUTH_WEST_1_4_WEST = {value: 236.25, label: "SW\u00BCW"};
const WEST_SOUTH_WEST = {value: 247.50, label: "WSW"};
const WEST_1_4_SOUTH_WEST = {value: 258.75, label: "W\u00BCSW"};
const WEST = {value: 270, label: "W"};
const WEST_1_4_NORTH_WEST = {value: 281.25, label: "W\u00BCNW"};
const WEST_NORTH_WEST = {value: 292.50, label: "WNW"};
const NORTH_WEST_1_4_WEST = {value: 303.75, label: "NW\u00BCW"};
const NORTH_WEST = {value: 315, label: "NW"};
const NORTH_WEST_1_4_NORTH = {value: 326.25, label: "NW\u00BCN"};
const NORTH_NORTH_WEST = {value: 337.50, label: "NNW"};
const NORTH_1_4_NORTH_WEST = {value: 348.75, label: "SN\u00BCNW"};

const WIND_COLORS = [
  'rgb(255, 255, 255)', // 0-5
  'rgb(19, 234, 186)',  // Light blue 5-10
  'rgb(21, 200, 232)',  // Blue 10-15
  'rgb(48, 232, 21)',   // Green 15-20
  'rgb(211, 239, 14)',  // Yellow 20-25
  'rgb(232, 180, 21)',  // Orange 25-30
  'rgb(232, 100, 21)',  // Darker Orange 30-35
  'rgb(180, 8, 0)',     // Red 35-40
  'rgb(147, 4, 0)',     // Dark red 40-45
  'rgb(148, 4, 161)'    // Purple 45+
];

function getWindColor(beaufort) {
  let colorIdx = Math.min(parseInt(beaufort.toFixed(0)), WIND_COLORS.length - 1);
  return WIND_COLORS[colorIdx];
}

const FRAME_WIDTH  = 160;
const FRAME_HEIGHT = 160;

function drawWindArrow(divId, dir, force) {
  let label = '';
  let fillColor = 'lime';
  if (force !== undefined) {
    label = `F${force}, `;
    fillColor = getWindColor(force);
  }
  let direction;  // = dir; //  + 180;
  if (typeof(dir) === 'number') {
    direction = (dir + 180) % 360;
    label += `${dir}°`
  } else {
    try {
      direction = (dir.value + 180) % 360;
      label += dir.label;
    } catch (oops) {
      console.log('Akeu what?')
      direction = 0;
    }
  }
  let title = null;
  if (force !== undefined && typeof(dir) !== 'number') {
    title = `Wind ${force} Beaufort\x0A${dir.label}`;
  }

  direction = -direction;
  // XMLNS Required.
  const XMLNS = "http://www.w3.org/2000/svg";

  let parent = (divId !== null) ? document.getElementById(divId) : null;
  if (title !== null && parent !== null) {
    parent.setAttribute('title', title);

  }
  let svg = document.createElementNS(XMLNS, 'svg');
  // svg.setAttribute('xmlns', xmlns);
  svg.setAttributeNS(null, 'width', FRAME_WIDTH.toString());
  svg.setAttributeNS(null, 'height', FRAME_HEIGHT.toString());
  svg.setAttribute('style', 'background-color: rgba(255, 255, 255, 0); border-radius: 10px; border: 1px solid blue;');

  if (parent !== null) {
    parent.appendChild(svg);
  }

  let circle = document.createElementNS(XMLNS, 'circle');
  circle.setAttributeNS(null, 'cx', (FRAME_WIDTH / 2).toString());
  circle.setAttributeNS(null, 'cy', (FRAME_HEIGHT / 2).toString());
  circle.setAttributeNS(null, 'r', '40');
  circle.setAttributeNS(null, 'stroke', 'rgba(0, 255, 0, 1)');
  circle.setAttributeNS(null, 'stroke-width', '4');
  circle.setAttributeNS(null, 'fill', 'rgba(0, 255, 255, 0.25)');
  svg.appendChild(circle);

  let polygon = document.createElementNS(XMLNS, 'polygon');
  polygon.setAttribute('style', `fill: ${fillColor}; stroke: blue; stroke-width: 2;`);

  let headX = (FRAME_WIDTH / 2) + (60 * Math.sin(Math.toRadians(direction)));
  let headY = (FRAME_HEIGHT / 2) + (60 * Math.cos(Math.toRadians(direction)));
  let arrow = [{
    // head
    x: headX,
    y: headY
  }, {
    // tail - left
    x: (FRAME_WIDTH / 2) - (60 * Math.sin(Math.toRadians(direction + 10))),
    y: (FRAME_HEIGHT / 2) - (60 * Math.cos(Math.toRadians(direction + 10)))
  }, {
    // tail - center
    x: (FRAME_WIDTH / 2) - (55 * Math.sin(Math.toRadians(direction))),
    y: (FRAME_HEIGHT / 2) - (55 * Math.cos(Math.toRadians(direction)))
  }, {
    // tail - right
    x: (FRAME_WIDTH / 2) - (60 * Math.sin(Math.toRadians(direction - 10))),
    y: (FRAME_HEIGHT / 2) - (60 * Math.cos(Math.toRadians(direction - 10)))
  }];
  // Draw polygon points here
  let points = ""; // `${head.x.toFixed(0)},${head.y.toFixed(0)} ${tailRight.x.toFixed(0)},${tailRight.y.toFixed(0)} ${tail.x.toFixed(0)},${tail.y.toFixed(0)} ${tailLeft.x.toFixed(0)},${tailLeft.y.toFixed(0)}`;
  arrow.forEach(pt => {
    points += `${pt.x.toFixed(0)},${pt.y.toFixed(0)} `;
  });
  // console.log('Points:' + points.trim());
  polygon.setAttributeNS(null, 'points', points.trim());
  svg.appendChild(polygon);

  let text = document.createElementNS(XMLNS, 'text');
  text.setAttributeNS(null, 'x', '10');
  text.setAttributeNS(null, 'y', '25');
  text.setAttributeNS(null, 'font-size', '16');
  text.setAttributeNS(null, 'font-family', "'Helvetica Neue', 'Lato', Verdana, Helvetica, Geneva, sans-serif;");
  text.setAttributeNS(null, 'fill', 'blue');
  text.appendChild(document.createTextNode(`${label}`));
  svg.appendChild(text);

  if (parent !== null && DEBUG) {
    console.log(parent.innerHTML);
  }
  //debugger;
  return { x: headX, y: headY, svgContent: svg };
}


