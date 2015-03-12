"use strict";
var express = require('express');
var router = express.Router();
var Twitter = require('twitter');
var _ = require('lodash');

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

router.post('/setSN', function(req, res) {
  var SN = req.body["screenName"];
  console.log('Twitter client GET with sn=' + SN);
  client.get('statuses/user_timeline', { screen_name: SN, count: 200 }, function(error, tweets, response){
    console.log(error);
    if (!error) {
      res.json(_.map(tweets, function(x) { return x.text; }));
    }
  });
});

var params = {screen_name: ''};
router.get('/tweets', function(req, res) {
  client.get('statuses/user_timeline', params, function(error, tweets, response){
    if (!error) {
      console.log(tweets);
//      res.json(tweets);
      res.json(_.map(tweets, function(x) { return x.text; }));
    }
  });
});

module.exports = router;
