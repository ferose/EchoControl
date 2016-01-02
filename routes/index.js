var express = require('express');
var router = express.Router();
var exec = require('child_process').exec;
var request = require('request')
var cheerio = require('cheerio');
var path = require('path');

function runAutoIt(name, param, cb) {
  var autoitDir = path.join(__dirname, "../", "autoit", name + ".exe")
  exec(autoitDir + ' ' + '"' + param + '"', cb);
}

function endEchoSession(message) {
  var resp = {
    "version": "1.0",
    "response": {
      "shouldEndSession": true
    },
    "sessionAttributes": {}
  }

  if (message) {
    resp.response.outputSpeech = {
      "type": "PlainText",
      "text": message
    }
  }

  return resp;
}

/* GET home page. */
router.post('/youtube', function(req, res, next) {
  var intent = req.body.request.intent;
  if (intent.name === "PlayYoutube") {
    var term = req.body.request.intent.slots.Search.value;
    if (!term) {
      runAutoIt("presskeys", "k");
      res.send(endEchoSession());
      return;
    }
    request({url: 'https://www.youtube.com/results?search_query='+encodeURIComponent(term)+''}, function (error, response, body) {
      // Do more stuff with 'body' here
      var link = cheerio.load(body)(".yt-lockup-video .yt-lockup-title a")[0]
      if (!link) {
        res.send(endEchoSession("could not find " + term + " on youtube"));
        return;
      }
      var linkURL = link.attribs.href;
      runAutoIt("openchrome", "https://youtube.com" + linkURL);
      res.send(endEchoSession("playing " + term + " on youtube"));
    });

  }
  else if (intent.name ===  "FullscreenYoutube") {
    runAutoIt("presskeys", "f");
    res.send(endEchoSession());
  }
  else if (intent.name === "NextVideo") {
    runAutoIt("presskeys", "+n");
    res.send(endEchoSession("playing next item"));
  }
  else if (intent.name === "PreviousVideo") {
    runAutoIt("presskeys", "!{LEFT}");
    res.send(endEchoSession("going back"));
  }
});

module.exports = router;
