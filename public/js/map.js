function Map() {
  "use strict";

  var map = L.map('mapid').setView([-47, 120], 2);

  L.tileLayer('http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

  var clusters = L.markerClusterGroup();
  map.addLayer(clusters);

  var icons = {
    positive: L.divIcon({className: 'dot positive'}),
    negative: L.divIcon({className: 'dot negative'}),
    neutral: L.divIcon({className: 'dot'})
  };

  var markers = [];
  var lastMarker;

  const THRESHOLD = 1000*5;

  let lastPosted = 0;


  function addMarker(html, coords, sentiment) {
    "use strict";

    const icon = icons[sentiment];

    const marker = L
      .marker(coords, { icon })
      .bindPopup(html);

    const now = Date.now();

    if (now - lastPosted > THRESHOLD) {
      lastPosted = now;

      // if (lastMarker) {
      //   map.removeLayer(lastMarker);
      //   clusters.addLayer(lastMarker);
      // }

      marker
        .addTo(map)
        .openPopup();
      // lastMarker = marker;

    } else {
      // marker.addTo(clusters);
      marker.addTo(map);
    }

    if (markers.length > 1000) {
      // clusters.removeLayer(markers.shift());
      map.removeLayer(markers.shift());
    }

    return marker;
  }

  // (function addHeat() {
  //   "use strict";
  //   if (heat) map.removeLayer(heat);
  //   console.log(coords);
  //   heat = L.heatLayer(coords, {radius: 25 });
  //   heat.addTo(map);
  //
  //   setTimeout(addHeat, 2000);
  // })();

  return {
    addMarker,
    map
  };

}