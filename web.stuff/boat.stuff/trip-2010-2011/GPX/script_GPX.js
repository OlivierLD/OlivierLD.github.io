if (Math.toRadians === undefined) {
    Math.toRadians = deg => {
        return (deg / 180) * Math.PI;
    };
}

if (Math.toDegrees === undefined) {
    Math.toDegrees = rad => {
        return rad * 180 / Math.PI;
    };
}

const WIND_COLORS = [
    'rgb(255, 255, 255)', // 0-5
    'rgb(21, 200, 232)',  // Blue 5-10
    'rgb(19, 234, 186)',  // Lighter blue 10-15
    'rgb(48, 232, 21)',   // Green 15-20
    'rgb(211, 239, 14)',  // Yellow 20-25
    'rgb(232, 180, 21)',  // Orange 25-30
    'rgb(232, 100, 21)',  // Darker Orange 30-35
    'rgb(180, 8, 0)',     // Red 35-40
    'rgb(147, 4, 0)',     // Dark red 40-45
    'rgb(148, 4, 161)'    // Purple 45-
];
function getWindColor(beaufort) {
    let colorIdx = Math.min(parseInt(beaufort).toFixed(0), WIND_COLORS.length - 1);
    return WIND_COLORS[colorIdx];
}

function drawWindArrow(dir, force) {

    let fillColor = 'lime';
    if (force !== undefined) {
        fillColor = getWindColor(force);
    }
    let direction;  // = dir; //  + 180;
    if (typeof(dir) === 'number') {
        direction = dir;
    }
    direction = -direction;

    let arrowSize = 10 + (force * 20);

    // XMLNS Required.
    const XMLNS = "http://www.w3.org/2000/svg";

    let svg = document.createElementNS(XMLNS, 'svg');
    // svg.setAttribute('xmlns', xmlns);
    svg.setAttributeNS(null, 'width', arrowSize.toString());
    svg.setAttributeNS(null, 'height', arrowSize.toString());
    svg.setAttribute('style', 'background-color: rgba(255, 255, 255, 0);');

    let polygon = document.createElementNS(XMLNS, 'polygon');
    polygon.setAttribute('style', `fill: ${fillColor}; stroke: red; stroke-width: 1;`);

    let headX = (arrowSize / 2) + ((arrowSize * 0.375) * Math.sin(Math.toRadians(direction)));
    let headY = (arrowSize / 2) + ((arrowSize * 0.375) * Math.cos(Math.toRadians(direction)));
    let arrow = [{
        // head
        x: headX,
        y: headY
    }, {
        // tail - left
        x: (arrowSize / 2) - ((arrowSize * 0.375) * Math.sin(Math.toRadians(direction + 10))),
        y: (arrowSize / 2) - ((arrowSize * 0.375) * Math.cos(Math.toRadians(direction + 10)))
    }, {
        // tail - center
        x: (arrowSize / 2) - ((arrowSize * 0.34375) * Math.sin(Math.toRadians(direction))),
        y: (arrowSize / 2) - ((arrowSize * 0.34375) * Math.cos(Math.toRadians(direction)))
    }, {
        // tail - right
        x: (arrowSize / 2) - ((arrowSize * 0.375) * Math.sin(Math.toRadians(direction - 10))),
        y: (arrowSize / 2) - ((arrowSize * 0.375) * Math.cos(Math.toRadians(direction - 10)))
    }];
    // Draw polygon points here
    let points = ""; // `${head.x.toFixed(0)},${head.y.toFixed(0)} ${tailRight.x.toFixed(0)},${tailRight.y.toFixed(0)} ${tail.x.toFixed(0)},${tail.y.toFixed(0)} ${tailLeft.x.toFixed(0)},${tailLeft.y.toFixed(0)}`;
    arrow.forEach(pt => {
        points += `${pt.x.toFixed(0)},${pt.y.toFixed(0)} `;
    });
    // console.log('Points:' + points.trim());
    polygon.setAttributeNS(null, 'points', points.trim());
    svg.appendChild(polygon);
    return { x: headX, y: headY, svgContent: svg };
}

// function durationToDate(duration) { // like "2018-03-23T13:59:25Z"
//     let dateTime = duration.split("T");
//     let ymd = dateTime[0].split("-");
//     let hms = dateTime[1].split(":");
//     let date = new Date(parseInt(ymd[0]),
//         parseInt(ymd[1]),
//         parseInt(ymd[2]),
//         parseInt(hms[0]),
//         parseInt(hms[1]),
//         parseInt(hms[2]),
//         0);
//     return date;
// }
//
function loadJSON(jsonURL, callback) {
    let xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonURL, true);
    xobj.onreadystatechange = () => {
        if (xobj.readyState == 4 && xobj.status == "200") { // Happy
            if (callback !== undefined) {
                callback(xobj.responseText);
            }
        } // TODO else...
    };
    xobj.send(null);
}

function loadData() {
    let map = L.map('mapid'); // .setView([currentLatitude, currentLongitude], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(map);

// Get QS parameters:
// track=leg.01.gpx
// &scale=5
// &upTo=2010-10-02T22:45:00Z
// &plot=-8.92/-140.10

    let track = getPrm('track');
    let scale = parseInt(getPrm('scale'));
    let upTo = getPrm('upTo');
    let plot = getPrm('plot');

    let upToDate = null;
    if (upTo !== undefined && upTo.trim().length > 0) {
        upToDate = durationToDate(upTo);
        // console.log('UpTo', upToDate);
    }

    loadJSON(track, data => {
        let jsonData = JSON.parse(data);
        console.log('Data', jsonData);
        console.log('Up to', upTo);
        // 1 - Build track
        let latlngs = [];
        let markers = [];
        let windArrows = [];
        if (jsonData.gpx.trk !== undefined) {
            let trk = jsonData.gpx.trk;
            if (trk.trkseg.trkpt !== undefined) {
                trk.trkseg.trkpt.forEach(pt => {
                    if (pt.type === 'WPT') {
                        let addToList = true;
                        if (upToDate !== null) {
                            if (pt.time !== undefined) {
                                let time = durationToDate(pt.time);
                                if (time > upToDate) {
                                    addToList = false;
                                }
                            }
                        }
                        if (addToList) {
                            latlngs.push([pt._lat, pt._lon]);
                            if (pt.extension !== undefined) {
                                if (pt.extension.wind !== undefined) {
                                    windArrows.push({ lat: pt._lat,
                                        lng: pt._lon,
                                        direction: parseInt(pt.extension.wind.direction),
                                        force: parseInt(pt.extension.wind.force) });
                                }
                            }
                        }
                    }
                });
                let polyline = L.polyline(latlngs, {color: 'red'}).addTo(map);
                // zoom the map to the polyline
                map.fitBounds(polyline.getBounds());

                if (windArrows.length > 0) {
                    windArrows.forEach(arrow => {
                        let windArrow = drawWindArrow(arrow.direction, arrow.force);

                        let markerIcon = L.divIcon({
                            className: 'my-div-icon-marker', // Optional. CSS class, default ''.
                            iconAnchor: [windArrow.x, windArrow.y],            // Should be the location of the pointy head, in pixels.
                            html: windArrow.svgContent  // DOM Element, SVG content
                        });
                        L.marker([arrow.lat, arrow.lng], {icon: markerIcon}).addTo(map);
                    });
                }

            }
        }
    });
}


function loadPlotterData() {
    let map = L.map('mapid'); // .setView([currentLatitude, currentLongitude], 13);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
            '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
            'Imagery © <a href="http://mapbox.com">Mapbox</a>',
        id: 'mapbox.streets'
    }).addTo(map);

// Get QS parameters:
//  latitude=-8.927639155051756
//  &longitude=-140.01693534781225
//  &scale=11
//  &label=Cape%20Martin

    let lat = parseFloat(getPrm('latitude'));
    let lon = parseFloat(getPrm('longitude'));
    let scale = parseInt(getPrm('scale'));
    let label = unescape(getPrm('label'));

    let marker = L.marker([lat, lon]);
    marker.addTo(map)
          .bindPopup('<b>' + label + '</b>');

    map.setView(new L.LatLng(lat, lon), scale);
}

function getPrm(prmName) {
    let loc = document.location.toString();
    let i = loc.indexOf(prmName + "=");
    let value = '';
    if (i > -1) {
        let str = loc.substr((prmName.length + 1) + i);
        let j = str.indexOf('&');
        if (j > -1) {
          value = str.substr(0, j);
        } else {
          value = str;
        }
    }
//alert(prmName + " = " + value);    
    return value;
}

function datapoint(latitude, longitude, datetime) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.datetime = datetime;
}

let lang = "EN"; // Default value

function getBeaufortSpeed(force) {
    let speed = 0;
    if (force === 0) {
        speed = 1;
    } else if (force === 1) {
        speed = 3;
    } else if (force === 2) {
        speed = 6;
    } else if (force === 3) {
        speed = 10;
    } else if (force === 4) {
        speed = 16;
    } else if (force === 5) {
        speed = 21;
    } else if (force === 6) {
        speed = 27;
    } else if (force === 7) {
        speed = 33;
    } else if (force === 8) {
        speed = 40;
    } else if (force === 9) {
        speed = 47;
    } else if (force === 10) {
        speed = 55;
    } else if (force === 11) {
        speed = 63;
    } else {
        speed = 64;
    }
    return speed;
}

function durationToDate(duration) {
    let yyyy = duration.substring(0, 4);
    let mm = duration.substring(5, 7);
    mm -= 1;
    let dd = duration.substring(8, 10);
    let hh = duration.substring(11, 13);
    let mi = duration.substring(14, 16);
    let ss = duration.substring(17, 19);

    let utcOffset = 0;

    let trailer = duration.substring(19);
    if (trailer.indexOf("+") >= 0 || trailer.indexOf("-") >= 0) {
        if (trailer.indexOf("+") >= 0) {
            trailer = trailer.substring(trailer.indexOf("+") + 1);
        }
        if (trailer.indexOf("-") >= 0) {
            trailer = trailer.substring(trailer.indexOf("-"));
        }
        if (trailer.indexOf(":") > -1) {
            let hours = trailer.substring(0, trailer.indexOf(":"));
            let mins = trailer.substring(trailer.indexOf(":") + 1);
            utcOffset = parseFloat(hours) + (parseFloat(mins) / 60);
        } else {
            utcOffset = parseFloat(trailer);
        }
    }
    let date = new Date(yyyy, mm, dd, hh, mi, ss, 0);
    let time = date.getTime();
    time = time - (utcOffset * 3600 * 1000);
    return new Date(time);
}

function sexagesimalToDecimal(d, m, sgn) {
    let value = parseFloat(d);
    value += (parseFloat(m) / 60.0);
    if (sgn === W || sgn === S) {
        value = -value;
    }
    return value;
}

function deadReckoning(l, g, s, d) {
    let deltaL = (s / 60) * Math.cos(Math.toRadians(d));
    let l2 = l + deltaL;
    let lc1 = getIncLat(l);
    let lc2 = getIncLat(l2);
    let deltaLc = lc2 - lc1;
    let deltaG = deltaLc * Math.tan(Math.toRadians(d));
    let g2 = g + deltaG;
    return [l2, g2];
}

function getIncLat(lat) {
    let il = Math.log(Math.tan((Math.PI / 4) + (Math.toRadians(lat) / 2)));
    return Math.toDegrees(il);
}
