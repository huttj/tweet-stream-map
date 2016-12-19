import express         from 'express';
import morgan          from 'morgan';
import bodyParser      from 'body-parser';
import cookieParser    from 'cookie-parser';
import socketio        from 'socket.io';
import Twit            from 'twit';
import http            from 'http';
import sentiment       from 'sentiment';

import geoCode         from './util/geoCode';


const app = express();
const server = http.Server(app);
const io = socketio(server);

const T = new Twit({
  consumer_key        : process.env.TWITTER_CONSUMER_KEY,
  consumer_secret     : process.env.TWITTER_CONSUMER_SECRET,
  access_token        : process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret : process.env.TWITTER_ACCESS_SECRET,
  timeout_ms          : 60*1000  // optional HTTP request timeout to apply to all requests.
});

var world = [
  '-180',
  '-90',
  '180',
  '90'
];

var stream = T.stream('statuses/filter', { track: process.env.TWEET_TERM, locations: world });

stream.on('tweet', tweet => processTweet(tweet).catch(console.error));

const termRegExp = new RegExp(process.env.TWEET_TERM, 'i');

async function processTweet (tweet) {
  "use strict";

  if (!termRegExp.test(tweet.text)) return;

  tweet.sentiment = sentiment(tweet.text).comparative;

  if (tweet.user.location) {

    try {
      if (tweet.geo) {
        tweet.coordinates = tweet.geo.coordinates;
      } else {
        tweet.coordinates = await geoCode(tweet.user.location);
      }

      let feeling = 'neutral';
      if (tweet.sentiment > 0) {
        feeling = 'positive';
      } else if (tweet.sentiment > 0) {
        feeling = 'negative';
      }

      console.log(`
        ${tweet.text}
        ${tweet.user.location}
        ${feeling}
      `);

      io.emit('tweet', tweet);
    } catch (e) {
      console.log('Failed to geocode:', tweet.user.location);
    }

  }

}

io.on('connection', async function(socket){
  console.log('a user connected');
});

app
  .use(morgan('combined'))
  .use('/', express.static(__dirname + '/../public'))
  .use(bodyParser.json())
  .use(cookieParser());

server.listen(process.env.PORT);