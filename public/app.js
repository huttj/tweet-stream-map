var map = L.map('mapid').setView([-47, 120], 2);

L.tileLayer('http://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(map);

var socket = io();


var tweets = [];
var coords = [];

const THRESHOLD = 1000*3;

let lastPosted = 0;
let heat;

function fuzz(num) {
  "use strict";
  const i = Math.random() < .5 ? -1 : 1;
  return num * (1 + (i * Math.random()/300));
}

function linkify(text) {
  "use strict";
  return text
    .replace(/https\:[^ ]+/g, function(match, c, i) {
      return `<a href="${match}">${match}</a>`;
    });
}

function addMarker(tweet) {
  "use strict";

  const [lat, long] = tweet.coordinates;

  var marker = L
    .marker([fuzz(lat), fuzz(long)])
    .bindPopup(`
      <div>
        <p>${linkify(tweet.text)}</p>
        <p>
          <strong>${tweet.user.name}</strong><br>
          <em>${tweet.user.location}</em><br>
          ${new Date(+tweet.timestamp_ms).toLocaleString()}
        </p>
      </div>
    `);

  const now = Date.now();
  if (now - lastPosted > THRESHOLD) {
    lastPosted = now;
    marker
      .addTo(map)
      .openPopup();
  }

  coords.push([lat, long, 1]);

  return marker;
}

(function addHeat() {
  "use strict";
  if (heat) map.removeLayer(heat);
  console.log(coords);
  heat = L.heatLayer(coords, {radius: 25 });
  heat.addTo(map);

  setTimeout(addHeat, 2000);
})();

socket.on('tweet', tweet => {
  "use strict";

  // console.log(tweet);

  tweets.push(addMarker(tweet));

  if (tweets.length > 50) {
    // for (var i = 0; i < 10; i++) {
    map.removeLayer(tweets.shift());
    // coords.shift();
    // }
  }

});
