const n = "N";
const s = "S";
const e = "E";
const w = "W";

const ns = "NS";
const ew = "EW";

function decToSex(v, ns_ew) {
    let absVal = Math.abs(v);
    let intValue = Math.floor(absVal);
    let dec = absVal - intValue;
    let i = intValue;
    dec *= 60;
    let s = String(i) + "\xb0" + dec.toFixed(2) + "'"; // \xb0 = \272
    if (v < 0) {
        switch(ns_ew) {
            case ns:
                s += "S";
                break;
            case ew:
                s +="W";
                break;
        }
    } else {
        switch(ns_ew) {
            case ns:
                s += "N";
                break;
            case ew:
                s += "E";
                break;
        }
    }
    return s;
}

function makeMarker(markerData) {
    L.marker([markerData.position.lat, markerData.position.lng])
     .addTo(markerData.map)
     .bindPopup(markerData.title);
}

function initialize(userPos, map) {

    userPos.forEach(element => {
        let pos = new L.LatLng(element.latitude, element.longitude);
        makeMarker({
            position: pos,
            map: map,
            title: element.platform + ", " + element.lang
        });
    });

    let tooltip = null;
    map.addEventListener('mousemove', (event) => {
        // let lat = Math.round(event.latlng.lat * 100000) / 100000;
        // let lng = Math.round(event.latlng.lng * 100000) / 100000;
        let lat = event.latlng.lat;
        let lng = event.latlng.lng;
        while (lng > 180) {
            lng -= 360;
        }
        while (lng < -180) {
            lng += 360;
        }
        document.getElementById('curr-pos').innerHTML = `${decToSex(lat, "NS")} / ${decToSex(lng, "EW")} (${lat.toFixed(6)} / ${lng.toFixed(6)})`;
        if (tooltip != null) {
            map.removeLayer(tooltip);
        }
        tooltip = L.tooltip()
                   .setLatLng(L.latLng([lat, lng]))
                   .setContent(`${decToSex(lat, "NS")}<br/>${decToSex(lng, "EW")}`)
                   .addTo(map);
    });

}
// google.maps.event.addDomListener(window, 'load', initialize);

