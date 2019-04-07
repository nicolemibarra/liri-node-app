rrequire("dotenv").config();

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var request = require('request');
var moment = require('moment');
var axios = require('axios');

var action = process.argv[2];
var parameter = process.argv[3];

function switchCase() {
  switch (action) {
    case 'concert-this':
      bandsInTown(parameter);                   
      break;                          
    case 'spotify-this-song':
      spotifySong(parameter);
      break;
    case 'movie-this':
      movieInfo(parameter);
      break;
    case 'do-what-it-says':
      getRandom(parameter);
      break;
      default:                            
      logIt("Invalid Instruction");
      break;
  }
};

function bandsInTown() {

if (parameter === 'concert-this') 
{
	var bandName = "";
  for (var i = 3; i < process.argv.length; i++)
  {
    bandName+=process.argv[i];
  }
}
else {
	bandName = parameter;
}

var queryUrl = "https://rest.bandsintown.com/artists/"+bandName+"/events?app_id=codingbootcamp";
request(queryUrl, function(error, response, body) {
  if (!error && response.statusCode === 200) {
    var JS = JSON.parse(body);
    for (i = 0; i < JS.length; i++)
    {

      logIt("________________________________________");
      logIt("Name of Venue: " + JS[i].venue.name);
      logIt("Venue Location: " + JS[i].venue.city);
      logIt("Date of the Event: " + moment().format('MM/DD/YYYY'));
    }
  }
});
}

function spotifySong() {
  var searchTrack;
  if (parameter === undefined) {
    searchTrack = 'The Sign Ace of Base';
  } else {
    searchTrack = parameter;
  }
  spotify.search({
    type: 'track',
    query: searchTrack
  }, function(error, data) {
    if (error) {

      logIt('Please try another selection.' + error);
      return;
    } else {
      logIt("________________________________________");
      logIt("Artist: " + data.tracks.items[0].artists[0].name);
      logIt("Song: " + data.tracks.items[0].name);
      logIt("Preview: " + data.tracks.items[3].preview_url);
      logIt("Album: " + data.tracks.items[0].album.name);
    }
  });
};

function movieInfo(action3) {
  var findMovie;
  if (action3 === undefined) {
    findMovie = 'Mr. Nobody';
  } else {
    findMovie = action3;
  };
  var queryUrl = "http://www.omdbapi.com/?t=" + findMovie + "&y=&plot=short&apikey=trilogy";
  request(queryUrl, function(error, response, body) {
  	var bodyOf = JSON.parse(body);
    if (!error && response.statusCode === 200) {

      logIt("________________________________________");
      logIt("Movie Title: " + bodyOf.Title);
      logIt("Year Released: " + bodyOf.Year);
      logIt("IMDB Rating: " + bodyOf.imdbRating);
      logIt("Rotten Tomatoes Rating: " + bodyOf.Ratings[1].Value); 
      logIt("Country Produced: " + bodyOf.Country);
      logIt("Language: " + bodyOf.Language);
      logIt("Plot: " + bodyOf.Plot);
      logIt("Actors: " + bodyOf.Actors);
    }
  });
};

function getRandom() {
  fs.readFile('random.txt', "utf8", function(error, data){
      if (error) {
          return logIt(error);
        }
  
      var dataArr = data.split(",");    
      if (dataArr[0] === "spotify-this-song") 
      {
        var songcheck = dataArr[1].trim().slice(1, -1);
        spotSong(songcheck);
      } 
      else if (dataArr[0] === "concert-this") 
      { 
        if (dataArr[1].charAt(1) === "'")
        {
          var dLength = dataArr[1].length - 1;
          var data = dataArr[1].substring(2,dLength);
          console.log(data);
          bandsInTown(data);
        }
        else
        {
          var bandName = dataArr[1].trim();
          console.log(bandName);
          bandsInTown(bandName);
      }
        
      } 
      else if(dataArr[0] === "movie-this") 
      {
        var movie_name = dataArr[1].trim().slice(1, -1);
        movieInfo(movie_name);
      } 
      
      });
  
  };
  
  function logIt(dataToLog) {
  
    console.log(dataToLog);
  
    fs.appendFile('log.txt', dataToLog + '\n', function(err) {
      
      if (err) return logIt('Error unable to log data to file: ' + err);	
    });
  }
  
  switchCase();
  
                   
                   
