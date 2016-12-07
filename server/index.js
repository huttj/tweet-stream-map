import express         from 'express';
import morgan          from 'morgan';
import bodyParser      from 'body-parser';
import cookieParser    from 'cookie-parser';
import socketio        from 'socket.io';
import nodeTweetStream from 'node-tweet-stream';
import http            from 'http';
import geoCode         from './util/geoCode';

const app = express();
const server = http.Server(app);
const io = socketio(server);
const tw = new nodeTweetStream({
  consumer_key    : process.env.TWITTER_CONSUMER_KEY,
  consumer_secret : process.env.TWITTER_CONSUMER_SECRET,
  token           : process.env.TWITTER_ACCESS_TOKEN,
  token_secret    : process.env.TWITTER_ACCESS_SECRET
});

tw.track(process.env.TWEET_TERM);

tw.on('tweet', async tweet => {
  "use strict";

  if (tweet.user.location) {

    try {
      tweet.coordinates = await geoCode(tweet.user.location);
      console.log('Geocoded:', tweet.user.location, tweet.coordinates);
      io.emit('tweet', tweet);
    } catch (e) {
      console.log('Failed to geocode:', tweet.user.location);
    }

  }

});

io.on('connection', function(socket){
  console.log('a user connected');
});

app
  .use(morgan('combined'))
  .use('/', express.static(__dirname + '/../public'))
  .use(bodyParser.json())
  .use(cookieParser());

server.listen(process.env.PORT);