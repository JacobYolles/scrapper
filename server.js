var express = require('express')
var mongojs = require("mongojs");
var logger = require("morgan");
var request = require("request");
var cheerio = require("cheerio");
var PORT = 3000;
// Initialize Express
var app = express();
var axios = require("axios");
// var exphbs  = require('express-handlebars');
var mongoose = require("mongoose");
 
// Require all models
var db = require("./models");

var bodyParser = require('body-parser')

var request = require('request');

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));



// Database configuration
var databaseUrl = "scrapehome"
var collections = ["scrapedData"]

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
  db.scrapedData.find({}, function(error, found) {
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

app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with request
  axios.get("https://www.vox.com/world").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
          res.json(dbArticle)
        })
        .catch(function(err) {
          // If an error occurred, send it to the client
          return res.json(err);
        });
    });

    // If we were able to successfully scrape and save an Article, send a message to the client
    res.send("Scrape Complete");
  });
});

// // Scrape data from one site and place it into the mongodb db
// app.get("/scrape", function(req, res) {
//   // Make a request for the news section of `ycombinator`
//   request("https://www.vox.com/world", function(error, response, html) {
//     // Load the html body from request into cheerio
//     var $ = cheerio.load(html);
//     // For each element with a "h2" class
//     $("h2").each(function(i, element) {
//       // Save the text and href of each link enclosed in the current element
//       var title = $(element).children("a").text();
//       var link = $(element).children("a").attr("href");

//       // If this found element had both a title and a link
//       if (title && link) {
//         // Insert the data in the scrapedData db
//         db.scrapedData.insert({
//           title: title,
//           link: link
//         },
//         function(err, inserted) {
//           if (err) {
//             // Log the error if one is encountered during the query
//             console.log(err);
//           }
//           else {
//             // Otherwise, log the inserted data
//             console.log(inserted);
//           }
//         });
//       }
//     });
//   });

//   // Send a "Scrape Complete" message to the browser
//   res.send("Scrape Complete");
// });


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
