/**
 * Some utilities for GoogleMap
 *
 * copyright 2007-2011, OlivSoft
 */
//<![CDATA[
// var debug = false;
// var plotTrackASAP = false;

var map;

var pointarray;

var N = "N";
var S = "S";
var E = "E";
var W = "W";

var NS = "NS";
var EW = "EW";

function getPrm(prmName) {
  var loc = document.location.toString();
  var i = loc.indexOf(prmName + "=");      
  var value = '';
  if (i > -1) {
    str = loc.substr((prmName.length + 1)+i);
    var j = str.indexOf('&');
    if (j > -1) 
      value = str.substr(0, j);
    else
      value = str;
  }
//alert(prmName + " = " + value);    
  return value;
}

function format(expr, decplaces)
{
  var str = "" + Math.round(eval(expr) * Math.pow(10, decplaces));
  while (str.length <= decplaces)
  {
    str = "0" + str;
  }
  var decpoint = str.length - decplaces;
  return str.substring(0, decpoint) + "." + str.substring(decpoint, str.length);
}

function decimalToSexagesimal(v, ns_ew)
{
  var s = "";
  var absVal = Math.abs(v);
  var intValue = Math.floor(absVal);
  var dec = absVal - intValue;
  i = intValue;
  dec *= 60;
  s = String(i) + "&deg;" + format(dec, 2) + "'";
  if (v < 0)
  {
    switch(ns_ew)
    {
      case NS:
        s = s + S;
        break;
      case EW:
      default:
        s = s + W;
        break;
    }
  }
  else
  {
    switch(ns_ew)
    {
      case NS:
        s = s + N;
        break;
      case EW:
      default:
        s = s + E;
        break;
    }
  }
  return s;
}

function isCloseTo(latlng)
{
  var ptId = -1;
  for (var j=0; j<pointarray.length; j++)
  {
    var pt = new GLatLng(pointarray[j].latitude, pointarray[j].longitude);
    var dist = pt.distanceFrom(latlng);
    if (dist < 50) // 50 meters
    {
      ptId = j;
      break;
    }
  }  
  return ptId;
}

var useGoogleEarthPlugIn = false;

function loadChart()
{
  if (false) // Previous version
  {
    map = new GMap2(document.getElementById("map"));
    map.addControl(new GLargeMapControl());
    map.addControl(new GMapTypeControl());
    map.addControl(new GOverviewMapControl());
  //map.setCenter(new GLatLng(topleftlat, topleftlng), 13);
    map.setMapType(G_SATELLITE_MAP);
  }
  else
  {
    map = new GMap2(document.getElementById("map"));
    map.addControl(new GLargeMapControl3D());
  //map.addControl(new GLargeMapControl());
  //map.addControl(new GLargeZoomControl3D());
  //map.addControl(new GMapTypeControl());
    map.setUIToDefault();
    map.addControl(new GOverviewMapControl());
  //map.setCenter(new GLatLng(20.00, -145.00), 3);

    map.addMapType(G_NORMAL_MAP );
    map.addMapType(G_AERIAL_MAP);
    map.addMapType(G_SATELLITE_MAP);
    map.addMapType(G_SATELLITE_3D_MAP);
    map.addMapType(G_PHYSICAL_MAP );

    if (useGoogleEarthPlugIn)
    {
      map.setMapType(G_SATELLITE_3D_MAP);
  	  map.enableRotation();
    }
    else
      map.setMapType(G_HYBRID_MAP);
  
  //map.setMapType(G_SATELLITE_MAP);
  //map.setMapType(G_AERIAL_MAP);
  }
  map.enableContinuousZoom();
  map.enableDoubleClickZoom();
  map.enableScrollWheelZoom();
//map.enableRotation();
}

function load() 
{
  // if (GBrowserIsCompatible()) 
  {
    loadChart();
    loadData();
  }
}

function datapoint(latitude, longitude, datetime)
{
  this.latitude = latitude;
  this.longitude = longitude;
  this.datetime = datetime;
}

var lang = "EN";

function mark(latitude, longitude, name)
{
  this.latitude = latitude;
  this.longitude = longitude;
  this.name = name;
}

var gmScale = 13;
var upto = null; // new Date();

var latitude = null;
var longitude = null;
var markerLabel = null;

var allData = new Array("GPX/full.trip.gpx");
       /*
                        "GPX/leg.01.gpx", // SF - Marquises
                        // TODO Add here the different Bays, Anaho, Ua-Pou
                        "GPX/leg.02.gpx", // Marquises - Tuamotu
						"GPX/leg.03.gpx", // Tuamotu - Tahiti
						"GPX/leg.tahiti.moorea.gpx",
						"GPX/leg.moorea.huahine.gpx",
						"GPX/leg.huahine.tahaa.gpx",
						"GPX/leg.tahaa.raiatea.gpx",
						"GPX/leg.raiatea.bora.gpx",
						"GPX/leg.04.gpx", // Bora-Bora - Tongareva
						"GPX/leg.05.gpx", // Tongareva - Christmas
						"GPX/leg.06.gpx", // Christmas - Hawaii
						"GPX/leg.07.gpx"  // Hawaii - Drakes Bay
						);
        */
function loadData()
{
  var _lng = getPrm("lang");
  if (_lng != null)
    lang = _lng;
  if (debug)
    GLog.write("Lang: " + lang);
	
  var track = getPrm("track");
  if (debug)
    GLog.write("Loading " + track);
  gmScale = parseInt(getPrm("scale"));
  if (debug)
    GLog.write("Scale " + gmScale);
  var strUpTo = getPrm("upTo");
//if (debug)
//  GLog.write("Up to [" + strUpTo + "]");
  if (strUpTo != null && strUpTo.length > 0)
    upto = durationToDate(getPrm("upTo"));
  if (debug)
    GLog.write("Up To :" + (upto==null?"null":upto.toString()));
	
  var full = getPrm("full");
  
  var plot = getPrm("plot");
  if (plot != null && plot.length > 0)
  {
    var lat = plot.substr(0, plot.indexOf("/"));  // before the slash
    var lng = plot.substr(plot.indexOf("/") + 1); // after the slash
    if (debug)
      GLog.write("Lat:" + lat + ", Long:" + lng);
    if (lat.length > 0 && lng.length > 0)  
    {
      var point = new GLatLng(lat, lng);
      map.setCenter(point, gmScale);
    //map.addOverlay(new GMarker(point));
      var marker = new GMarker(point);
      map.addOverlay(marker);			
    }
  }

  if (track != null && track.length > 0)
    GDownloadUrl(track, function (data, responseCode) 
                            {
                              var xml = GXml.parse(data);                              
                              if (debug)
                                GLog.write("Loaded, parsed");
                              var markers = xml.documentElement.getElementsByTagName("trkpt");
                              if (debug)
                                GLog.write("Found " + markers.length + " node(s).");
                              pointarray = new Array(0); // (markers.length);
                              var cLat = 0;
                              var cLng = 0;
                              for (var i=0; i<markers.length; i++) 
                              {
                                var dt = GXml.value(markers[i].getElementsByTagName("time")[0]);
//                              if (debug)
//                                GLog.write("DT:" + dt);
                                if (upto == null || (upto != null && durationToDate(dt) <= upto))
                                {
                                  cLat = markers[i].getAttribute("lat");
                                  cLng = markers[i].getAttribute("lon");
                             //   pointarray[i] = new datapoint(cLat,
                             //                                 cLng,
                             //                                 dt);
                                  pointarray.push(new datapoint(cLat,
                                                                cLng,
                                                                dt));
                                  var extension = markers[i].getElementsByTagName("extension")[0];
                                  if (extension != null)
                                  {
                                    if (debug)
                                      GLog.write("Extension exists");
                                    var wind = extension.getElementsByTagName("wind")[0];
                                    if (wind != null)
                                    {
                                      var force = parseFloat(GXml.value(wind.getElementsByTagName("force")[0]));
                                      var dir   = parseFloat(GXml.value(wind.getElementsByTagName("direction")[0]));
                                      drawWindFeather(parseFloat(cLat),
                                                      parseFloat(cLng),
                                                      getBeaufortSpeed(force),
                                                      dir);									  
                                      if (debug)
                                        GLog.write("i=" + i + ", Wind:" + force + ", " + dir);
                                    }
                                  }
												
                                }
                                else
                                {
                                  if (debug)
                                    GLog.write(dt + " Rejected.");
                                }
                              }
                              map.setCenter(new GLatLng(cLat, cLng), gmScale);
                              if (plotTrackASAP)
                                drawTrack();
                            });
  else if (full != null && full == 'y')
  {
    if (debug)
      GLog.write("Full Voyage");
    var cLat = 0;
    var cLng = 0;
    pointarray = new Array(0); // (markers.length);
    for (var t=0; t<allData.length; t++)
    {
      var _track = allData[t];
      if (debug)
        GLog.write("Parsing " + _track);
      GDownloadUrl(_track, function (data, responseCode) 
                            {
                              var markers;
                              var xml = GXml.parse(data);                              
                              if (debug)
                                GLog.write("Loaded, parsed");
                              markers = xml.documentElement.getElementsByTagName("trkpt");
                              if (debug)
                                GLog.write("Found " + markers.length + " node(s).");
                              for (var i=0; i<markers.length; i++) 
                              {
                                var dt = GXml.value(markers[i].getElementsByTagName("time")[0]);
                                if (debug)
                                  GLog.write("DT:" + dt);
                                if (true) // upto == null || (upto != null && durationToDate(dt) <= upto))
                                {
                                  cLat = markers[i].getAttribute("lat");
                                  cLng = markers[i].getAttribute("lon");
                             //   pointarray[i] = new datapoint(cLat,
                             //                                 cLng,
                             //                                 dt);
                                  pointarray.push(new datapoint(cLat,
                                                                cLng,
                                                                dt));
                                  var extension = markers[i].getElementsByTagName("extension")[0];
                                  if (extension != null)
                                  {
                                    if (debug)
                                      GLog.write("Extension exists");
                                    marker = extension.getElementsByTagName("marker")[0];
                                    if (marker != null)
                                    {
                                      var text = marker.getElementsByTagName("html-text");
                                      if (text != null && text.length > 0)
                                      {
                                        for (var l=0; l<text.length; l++)
                                        {
                                          if (text[l].getAttribute("lang") == lang)
                                          {
                                            if (debug)
                                              GLog.write("==> Text:" + unescape(GXml.value(text[l])));
                                            addMarker(cLat, cLng, unescape(GXml.value(text[l])));
                                          }
                                        }
                                      }
                                    }
                                    var wind = extension.getElementsByTagName("wind")[0];
                                    if (wind != null)
                                    {
                                      var speed = parseFloat(GXml.value(wind.getElementsByTagName("speed")[0]));
                                      var dir   = parseFloat(GXml.value(wind.getElementsByTagName("direction")[0]));
                                      drawWindFeather(parseFloat(cLat),
                                                      parseFloat(cLng),
                                                      speed,
                                                      dir);									  
                                      if (debug)
                                        GLog.write("i=" + i + ", Wind:" + speed + ", " + dir);
                                    }
                                  }
                                  if (debug)
				                    GLog.write("i=" + i + ", Lat:" + cLat + ", Long:" + cLng);
                                }
                                else
                                {
                                  if (debug)
                                    GLog.write(dt + " Rejected.");
                                }
                              }
                              if (debug)
                                GLog.write("Center: L=" + cLat + ", G=" + cLng);
                              map.setCenter(new GLatLng(cLat, cLng), gmScale);
                              if (plotTrackASAP)
                                drawTrack();	
                            });
	}
  }
  else
  {
    // Plot a point
    latitude    = getPrm("latitude");
    longitude   = getPrm("longitude");
    markerLabel = getPrm("label");

    if (debug)
      GLog.write("Lat:" + latitude + ", Lng:" + longitude + ", Label:" + markerLabel);

    var _point = new GLatLng(latitude, longitude);
    map.setCenter(_point, gmScale);
//  map.addOverlay(new GMarker(_point));
    var _marker = new GMarker(_point);
    GEvent.addListener(_marker, "click", function() 
                                        {
                                          _marker.openInfoWindowTabsHtml(createOneTab(markerLabel));
                                        });
    map.addOverlay(_marker);		
  }  
  
  var latDiv = document.createElement("div");
  var lonDiv = document.createElement("div");
  
  var latLabel = document.createTextNode("Latitude :");
  var lonLabel = document.createTextNode("Longitude:");
  
  // We define the function first
  function PositionControl() {}

  // To "subclass" the GControl, we set the prototype object to
  // an instance of the GControl object
  PositionControl.prototype = new GControl();

  // Creates a one DIV for each of the buttons and places them in a container
  // DIV which is returned as our control element. We add the control to
  // to the map container and return the element for the map class to
  // position properly.
  PositionControl.prototype.initialize = function(_map) 
  {
    var container = document.createElement("div");
	
//  var latDiv = document.createElement("div");
    this.setLabelStyle(latDiv);
    container.appendChild(latDiv);
    latDiv.appendChild(latLabel);

//  var lonDiv = document.createElement("div");
    this.setLabelStyle(lonDiv);
    container.appendChild(lonDiv);
    lonDiv.appendChild(lonLabel);
    
    _map.getContainer().appendChild(container);
    return container;
  }
	
  // By default, the control will appear in the top right corner of the
  // map with 7 pixels of padding.
  PositionControl.prototype.getDefaultPosition = function() 
  {
    return new GControlPosition(G_ANCHOR_BOTTOM_LEFT, new GSize(7, 40));
  }
	
  // Sets the proper CSS for the given button element.
  PositionControl.prototype.setLabelStyle = function(label) 
  {
//  label.style.textDecoration  = "underline";
    label.style.color           = "orange";  // was "white"
//  label.style.backgroundColor = "white";
    label.style.font            = "bold small Courier";
//  label.style.border          = "1px solid black";
    label.style.padding         = "2px";
    label.style.marginBottom    = "3px";
    label.style.textAlign       = "left";
//  label.style.width           = "6em";
//  label.style.cursor          = "pointer";
  }
  map.addControl(new PositionControl());
  GEvent.addListener(map, "mousemove", function(latlng)
                                       {
                                       	 if (latDiv.hasChildNodes())
                                           latDiv.removeChild(latLabel);
                                       	 if (lonDiv.hasChildNodes())
                                           lonDiv.removeChild(lonLabel);
                                         
                                         latLabel = document.createTextNode("Latitude :" + decimalToSexagesimalNoDeg(latlng.lat(), NS));
                                         lonLabel = document.createTextNode("Longitude:" + decimalToSexagesimalNoDeg(latlng.lng(), EW));
                                         
                                         latDiv.appendChild(latLabel);
                                         lonDiv.appendChild(lonLabel);
                                       });
}

function getBeaufortSpeed(force)
{
  var speed = 0;
  if (force == 0)
    speed = 1;
  else if (force == 1)
    speed = 3;
  else if (force == 2)
    speed = 6;
  else if (force == 3)
    speed = 10;
  else if (force == 4)
    speed = 16;
  else if (force == 5)
    speed = 21;
  else if (force == 6)
    speed = 27;
  else if (force == 7)
    speed = 33;
  else if (force == 8)
    speed = 40;
  else if (force == 9)
    speed = 47;
  else if (force == 10)
    speed = 55;
  else if (force == 11)
    speed = 63;
  else
    speed = 64; 
  return speed;
}

function addMarker(lat, lng, txt)
{
  var point = new GLatLng(lat, lng);
  var marker = new GMarker(point);
  GEvent.addListener(marker, "click", function() 
                                      {
                                        marker.openInfoWindowTabsHtml(createOneTab(txt));
                                      });
  map.addOverlay(marker);
}

function durationToDate(duration)
{
  yyyy = duration.substring( 0,  4);
  mm   = duration.substring( 5,  7);
  mm -= 1;
  dd   = duration.substring( 8, 10);
  hh   = duration.substring(11, 13);
  mi   = duration.substring(14, 16);
  ss   = duration.substring(17, 19);
  
  utcOffset = 0;
  
  trailer = duration.substring(19);
  if (trailer.indexOf("+") >= 0 ||
      trailer.indexOf("-") >= 0)
  {
    if (trailer.indexOf("+") >= 0)
      trailer = trailer.substring(trailer.indexOf("+") + 1);
    if (trailer.indexOf("-") >= 0)
      trailer = trailer.substring(trailer.indexOf("-"));
    if (trailer.indexOf(":") > -1)
    {
      hours = trailer.substring(0, trailer.indexOf(":"));
      mins  = trailer.substring(trailer.indexOf(":") + 1);
      utcOffset = parseFloat(hours) + (parseFloat(mins) / 60);
    }
    else
      utcOffset = parseFloat(trailer);
  }
  var date = new Date(yyyy, mm, dd, hh, mi, ss, 0);
  var time = date.getTime();
  time = time - (utcOffset * 3600 * 1000);
  return new Date(time);
}

function plotMarkers()
{
  for (var i=0; i<pointarray.length; i++)
  {
    var point = new GLatLng(parseFloat(pointarray[i].latitude),
                            parseFloat(pointarray[i].longitude));
//  map.addOverlay(new GMarker(point));
    map.addOverlay(createMarker(point, i));
  }
}

function createTrackTab(i) 
{
  datevalue = pointarray[i].datetime;
  datestr = datevalue.substring(0, datevalue.indexOf("T"));
  timestr = datevalue.substring(datevalue.indexOf("T") + 1, datevalue.indexOf("."));
  var infoTabs = [
                   new GInfoWindowTab("Boat", "<font face='Tahoma'><small>" +
                                             "Date:" + datestr + "<br>" +
                                             "Time:" + timestr + "<br>" +
                                             "Speed Over Ground :" + pointarray[i].sog + " knots<br>" +
                                             "Course Over Ground:" + pointarray[i].cog +
                                             "</small></font>"),
                   new GInfoWindowTab("Conditions", "<font face='Tahoma'><small>" +
                                             "True Wind Speed    :" + pointarray[i].tws + " knots<br>" +
                                             "True Wind Angle    :" + pointarray[i].twa + "<br>" +
                                             "True Wind Direction:" + pointarray[i].twd + "<br>" +
                                             "Boat Speed         :" + pointarray[i].bsp + " knots<br>" +
                                             "Apparent Wind Speed:" + pointarray[i].aws + "<br>" +
                                             "Apparent Wind Angle:" + pointarray[i].awa + "<br>" +
                                             "</small></font>")
                 ];
  return infoTabs;
}

function createOneTab(txt) 
{
  var infoTabs = [
                   new GInfoWindowTab("Boat", "<font face='Tahoma'>" + unescape(txt) + "</font>")
                 ];
  return infoTabs;
}

function createMarker(point, i) 
{
  var marker = new GMarker(point);
  GEvent.addListener(marker, "click", function() 
                                      {
                                        marker.openInfoWindowTabsHtml(createTrackTab(i));
                                      });
  return marker;
}

function drawTrack()
{     
//alert("Plotting " + pointarray.length + " track Element(s)");
  var points = [];
  for (var i=0; i<pointarray.length; i++)
  {
    points.push(new GLatLng(pointarray[i].latitude, pointarray[i].longitude));
  }
  map.addOverlay(new GPolyline(points, "#ffff00", 1, 0.9));
  
  // Pictures
//plotPicture( 0, "pix/sophie.jpg", "Sophie", 200, 150);
//plotPicture(70, "pix/olivier.jpg", "Olivier", 200, 150);
}

function clearChart()
{
  map.clearOverlays();
}

var idx = 0;
var intervalID;

function plotPicture(ptNum, image, txt, w, h)
{
  var point = new GLatLng(parseFloat(pointarray[ptNum].latitude),
                          parseFloat(pointarray[ptNum].longitude));
  map.addOverlay(createPictureMarker(point, image, txt, w, h));
}

function createPictureMarker(point, img, txt, w, h) 
{
  var marker = new GMarker(point);
  GEvent.addListener(marker, "click", function() 
                                      {
                                        marker.openInfoWindowTabsHtml(createPicTab(img, txt, w, h));
                                      });
  return marker;
}

function createPicTab(img, txt, w, h) 
{
  var infoTabs = [
                   new GInfoWindowTab("Boat", txt + "<br><a href='" + img + "' target='new'><img border='0' src='" + img + "' width='" + w + "' height='" + h + "'></a>")
                 ];
  return infoTabs;
}

function sexagesimalToDecimal(d, m, sgn)
{
  var value = parseFloat(d);

  value += (parseFloat(m)/60.0);
  if (sgn == W || sgn == S)
    value = -value;
  return value;
}

function decimalToSexagesimal(v, ns_ew)
{
  var s = "";
  var absVal = Math.abs(v);
  var intValue = Math.floor(absVal);
  var dec = absVal - intValue;
  i = intValue;
  dec *= 60;
  s = String(i) + "&#176;" + format(dec, 2) + "'";
  if (v < 0)
  {
    switch(ns_ew)
    {
      case NS:
        s = S + " " + s;
        break;
      case EW:
      default:
        s = W + " " + s;
        break;
    }
  }
  else
  {
    switch(ns_ew)
    {
      case NS:
        s = N + " " + s;
        break;
      case EW:
      default:
        s = E + " " + s;
        break;
    }
  }
  return s;
}

function decimalToSexagesimalNoDeg(v, ns_ew)
{
  var s = "";
  var absVal = Math.abs(v);
  var intValue = Math.floor(absVal);
  var dec = absVal - intValue;
  i = intValue;
  dec *= 60;
  s = String(i) + "\u00B0" + format(dec, 2) + "'"; // \u00B0 is the degree symbol.
//s = String(i) + " " + format(dec, 2) + "'";
  if (v < 0)
  {
    switch (ns_ew)
    {
      case NS:
        s = S + " " + s;
        break;
      case EW:
      default:
        s = W + " " + s;
        break;
    }
  }
  else
  {
    switch (ns_ew)
    {
      case NS:
        s = N + " " + s;
        break;
      case EW:
      default:
        s = E + " " + s;
        break;
    }
  }
  return s;
}

function drawGRIBWind()
{
//alert("drawGRIBWind");
  
  for (i=0; i<windpoint.length; i++)
  {
//  GLog.write("Lat:" + windpoint[i].lat + ", Lng:" + windpoint[i].lng + ", Speed:" + windpoint[i].speed + ", Dir:" + windpoint[i].dir);
    drawWindFeather(windpoint[i].lat,
                    windpoint[i].lng,
                    windpoint[i].speed,
                    windpoint[i].dir);
  }
}

var SPEED_PRM = 2.0;

function drawWindFeather(lat, lng, speed, dir)
{
  if (debug)
    GLog.write("drawWindFeather: lat:" + lat + ", long:" + lng + ", Wind:" + speed + ", " + dir);
    
  var windpoints = [];  
  windpoints.push(new GLatLng(lat, lng));
  
  var onedash = false;
  if (onedash)
    windpoints.push(deadReckoning(lat, lng, speed * SPEED_PRM, dir));
  else
  {
    windpoints.push(deadReckoning(lat, lng, speed * SPEED_PRM, dir - 10));
    windpoints.push(deadReckoning(lat, lng, speed * SPEED_PRM * 0.9, dir));
    windpoints.push(deadReckoning(lat, lng, speed * SPEED_PRM, dir + 10));
    windpoints.push(new GLatLng(lat, lng));
  }
	
  var color = "#ffff00"; // yellow
	
  var lightblue = "#00ffff";
  var green     = "#00ff00";
  var yellow    = "#ffff00";
  var orange    = "#ff8000";
  var red       = "#ff0000";
	
  if (speed < 10) color = lightblue;
  else if (speed < 20) color = green;
  else if (speed < 30) color = yellow;
  else if (speed < 40) color = orange;
  else color = red;
	
  map.addOverlay(new GPolyline(windpoints, color, 1, 0.9));                                       
}

function getWindColor(speed)
{  
  return color;
}

function deadReckoning(l, g, s, d)
{
  deltaL = (s / 60) * Math.cos(toRadians(d));
  l2 = l + deltaL;
  lc1 = getIncLat(l);
  lc2 = getIncLat(l2);
  deltaLc = lc2 - lc1;
  deltaG = deltaLc * Math.tan(toRadians(d));
  g2 = g + deltaG;
  if (debug)
    GLog.write("deadReckoning: lat:" + l2 + ", long:" + g2);
  return new GLatLng(l2, g2);
}

function getIncLat(lat)
{
  il = Math.log(Math.tan((Math.PI / 4) + (toRadians(lat) / 2)));
  return toDegrees(il);
}

function toRadians(d)
{
  return Math.PI * d / 180;
}

function toDegrees(d)
{
  return d * 180 / Math.PI;
}
    