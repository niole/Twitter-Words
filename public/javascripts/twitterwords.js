"use strict";
/*global React*/
var Twitter = require('twitter');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
//var params = {screen_name: 'nodejs'};

var Displaytweet = React.createClass({
  loadTweet: function() {
    client.get('statuses/user_timeline', {screen_name: 'feynmanliang'}, function(error, tweets, response){
      if (!error) {
        console.log(tweets);
      }
    });
