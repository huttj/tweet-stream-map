function Tweets() {
  "use strict";

  function fuzz(num) {
    "use strict";
    // const i = Math.random() < .5 ? -1 : 1;
    // return num * (1 + (i * Math.random()/300));
    return num;
  }

  function linkify(text) {
    "use strict";
    return text
      .replace(/https\:[^ ]+/g, function(match, c, i) {
        return `<a href="${match}">${match}</a>`;
      });
  }

  function format(tweet) {
    "use strict";

    const [ lat, long ] = tweet.coordinates;
    const coords = [fuzz(lat), fuzz(long)];
    let sentiment = 'neutral';

    if (tweet.sentiment > 0) {
      sentiment = 'positive';
    } else if (tweet.sentiment < 0) {
      sentiment = 'negative';
    }

    const html = `
      <div>
        <p>${linkify(tweet.text)}</p>
        <p>
          <strong>${tweet.user.name}</strong><br>
          <em>${tweet.user.location}</em><br>
          ${new Date(tweet.created_at).toLocaleString()}<br>
          <span class="${sentiment}">${sentiment}</span>
        </p>
      </div>
    `;

    return { html, coords, sentiment };

  }

  return {
    format
  };

}