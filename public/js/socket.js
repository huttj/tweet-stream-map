function Socket({ map, tweets }) {

  let socket;

  function connect() {
    "use strict";
    socket = io();
  }

  function listen() {
    if (!socket) connect();

    socket.on('tweet', tweet => {
      "use strict";

      const {html, coords, sentiment } = tweets.format(tweet);
      map.addMarker(html, coords, sentiment);

    });
  }

  return {
    connect,
    listen
  };

}