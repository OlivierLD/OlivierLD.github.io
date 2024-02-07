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
    let s = String(i) + "\272" + dec.toFixed(2) + "'";
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

const homeBelz     = new L.LatLng(47.677667, -3.135667);
const home48Pos    = new L.LatLng(37.748857, -122.507248);
const homePosSloat = new L.LatLng(37.7356570913081, -122.50562265515327);
const homePos16th  = new L.LatLng(37.74816235907994, -122.47297748923302);
const homePosOysterPoint  = new L.LatLng(37.66423103659, -122.3803205788);
const homePosHMB  = new L.LatLng(37.5012987465, -122.4808859825);

const stCyrPos    = new L.LatLng(48.56065448774796, 2.0469988882541656);
const bavillePos  = new L.LatLng(48.563367466, 2.127465158700);

const homeSaintGuenael = new L.LatLng(47.59872311837526, -3.11967596411705);
const homeSaintMichel = new L.LatLng(47.59707680452755, -3.1133097410202026);

// Saint-Fargeau-Ponthierry
// 77310, France
const homePonthierry = new L.LatLng(48.530242, 2.550110);

const redstone = new L.LatLng(39.16742227893349, -107.24754850998374);


function makeMarker(markerData) {
    L.marker([markerData.position.lat, markerData.position.lng])
     .addTo(markerData.map)
     .bindPopup(markerData.title);
}

function initialize() {

    makeMarker({
        position: homeBelz,
        map: map,
        title: 'Beg er Lann, Belz'});

    makeMarker({
        position: home48Pos,
        map: map,
        title: '2010 48th avenue'});

    makeMarker({ 
        position: homePosSloat,
        map: map, 
        title: '2928 Sloat Blvd'});

    makeMarker({
        position: homePos16th,
        map: map,
        title: '2135 16th Avenue'});

    makeMarker({
        position: homePosOysterPoint,
        map: map,
        title: '95 Harbormaster Rd, Dock #5'
    });

    makeMarker({
        position: homePosHMB,
        map: map,
        title: 'Pillar Point, Dock H26'
    });

    makeMarker({
       position: stCyrPos,
        map: map,
        title: '19 rue des Loges'
    });

	makeMarker({
		position: bavillePos,
		map: map,
		title: 'Sente du Carrefour, Baville'
	});

    makeMarker({
      position: homeSaintGuenael,
      map: map,
      title: 'Saint Guena&euml;l, Plouharnel'
    });

	makeMarker({
		position: homeSaintMichel,
		map: map,
		title: 'rue Saint Michel, Plouharnel'
	});

	makeMarker({
		position: homePonthierry,
		map: map,
		title: '35 rue du vieux moulin, Ponthierry'
    });

    makeMarker({
		position: redstone,
		map: map,
		title: '95 Chair Mountain Drive, Redstone, CO'
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

