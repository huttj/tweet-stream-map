import _ from 'isomorphic-fetch';

const fail = Promise.reject();

const map = {
  everywhere: fail,
  Everywhere: fail,
  online: fail
};

function sleep(ms) {
  "use strict";
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

const load = (function() {
  "use strict";

  let lock = Promise.resolve();

  return function load(location) {
    "use strict";

    const next = lock
      .then(()=> sleep(1000))
      .then(()=> fetch(`http://nominatim.openstreetmap.org/search/${location}?format=json`).then(n => n.json()));

    lock = next.catch(()=>{});

    return next;
  };

}());


export default function(location) {
  "use strict";

  if (!map[location]) {
    map[location] = load(location).then(resp => [ resp[0].lat, resp[0].lon ]);
  }

  return map[location];
}
