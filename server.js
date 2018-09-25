var express = require('express')
var exphbs  = require('express-handlebars');
var app = express();
var mongoose = require("mongoose");
var mongojs = require("mongojs");
var bodyParser = require('body-parser')
var cheerio = require("cheerio");
var request = require("request");

var PORT = 3000;

// Database configuration
var databaseUrl = "scrapehome"
var collections = ["scraphomework"]

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

mongoose.connect("mongodb://localhost/scraphomework", { useNewUrlParser: true });

// Create a generate all function
// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.scraphomework.find({}, function(error, found) {
    // Throw any errors to the console
    if (error) {
      console.log(error);
    }
    // If there are no errors, send the data to the browser as json
    else {
      res.json(found);
    }
  });
});


// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request for the news section of `ycombinator`
  request("https://www.vox.com/world", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "h2" class
    $("h2").each(function(i, element) {
      // Save the text and href of each link enclosed in the current element
      var title = $(element).children("a").text();
      var link = $(element).children("a").attr("href");

      // If this found element had both a title and a link
      if (title && link) {
        // Insert the data in the scrapedData db
        db.scraphomework.insert({
          title: title,
          link: link
        },
        function(err, inserted) {
          if (err) {
            // Log the error if one is encountered during the query
            console.log(err);
          }
          else {
            // Otherwise, log the inserted data
            console.log(inserted);
          }
        });
      }
    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
