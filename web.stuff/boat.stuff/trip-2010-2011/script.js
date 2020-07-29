/**
 * Copyright and left, tamere
 */
const oneDay = 1000 * 60 * 60 * 24;
var startDate = setDate(2010, 10, 2);

var nbAnchors = 0;

function displayDate(year, month, day, lng) {
  document.write(formatDateHeader(year, month, day, lng));
}

var weekDaysEN = new Array ( "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" );
var weekDaysFR = new Array ( "Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi" );

var monthEN    = new Array ( "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" );
var monthFR    = new Array ( "janvier", "f&eacute;vrier", "mars", "avril", "mai", "juin", "juillet", "ao&ucirc;t", "septembre", "octobre", "novembre", "d&eacute;cembre" );

function formatDateHeader(year, month, day, lng) {
  var currentDate = setDate(year, month, day);
  var str = "<h4><a name='" + formatDateAnchor(nbAnchors) + "'>"
  str = str + formatDate(currentDate, lng) + "&nbsp;&nbsp<small>(" + (lng=="EN"?"day":"jour") + " " + (diffDateInDays(startDate, currentDate) + 1) + ")</small>";
  str = str + "</a>" + "&nbsp;&nbsp;&nbsp;";
  if (!getPrint()) {
    if (nbAnchors > 0) {
      str = str + "<a href='#" + formatDateAnchor(nbAnchors - 1) + "'><img src='previous.png' border='0' alt='" + previous(lng) + "' title='" + previous(lng) + "'></a>&nbsp;";
    }
    str = str + "<a href='#" + formatDateAnchor(nbAnchors + 1) + "'><img src='next.png' border='0' alt='" + next(lng) + "' title='" + next(lng) + "'></a>" + "</h4>";
  }
  nbAnchors++;
  
  return str;
}

function previous(lng) {
  var str = "previous";
  if (lng === "FR") {
    str = "pr&eacute;c&eacute;dent";
  }
  return str;
}

function next(lng) {
  var str = "next";
  if (lng === "FR") {
    str = "suivant";
  }
  return str;
}

function formatDateAnchor(idx) {
  return "DateAnchor-" + lpad(idx, "0", 4);
}

function lpad(i, padStr, len) {
  var s = i.toString();
  while (s.length < len) {
    s = padStr + s;
  }
  return s;
}

function setDate(year, month, day) {
  var date = new Date();
  date.setFullYear(year, month - 1, day);
  return date;
}

function formatDate(date, lng) {
  var dayInMonth = date.getDate();   // 1-31
  var dayOfWeek  = date.getDay();    // 0-6
  var month      = date.getMonth();  // 0-11
  var year       = date.getFullYear();
  
  var formattedDate = "";
  if (lng === "EN") {
    formattedDate = weekDaysEN[dayOfWeek] + ", " + monthEN[month] + " " + dayInMonth + ", " + year;
  } else if (lng === "FR") {
    formattedDate = weekDaysFR[dayOfWeek] + " " + dayInMonth + " " + monthFR[month] + " " + year;
  }
  return formattedDate;
}	

function diffDateInDays(dateFrom, dateTo) {
  var diff = (dateTo.getTime() - dateFrom.getTime()) / oneDay;
  return Math.floor(diff);
}

function getPrint() {
  var loc = document.location.toString();
  var i = loc.indexOf("?print");
  var print = false;
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
  var imgName = "CheoyLee42.";
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
    var elmt = document.getElementById(nodeName);
    var txt = document.createTextNode(elmt); 
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
  var imgName = "filmstrip.png";
  try { 
    var elmt = document.getElementById(nodeName); //    
    var txt = document.createTextNode(elmt); 
    elmt.innerHTML = "<img src='" + imgName + "' align='left' valign='top' width='203' height='8' alt='" + imgName + "' title='" + imgName + "'>"; 
  } catch (ex) { 
    alert("Exception! " + ex.toString()); 
  } 
}

function reset(nodeName) { 
  try { 
    var elmt = document.getElementById(nodeName); //    
    var txt = document.createTextNode(elmt); 
    elmt.innerHTML = ""; 
  } catch (ex) { 
    alert("Exception! " + ex.toString()); 
  } 
}
