var express = require('express')
var exphbs  = require('express-handlebars');
var app = express();
var mongoose = require("mongoose");

var bodyParser = require('body-parser')
var cheerio = require("cheerio");
var request = require("request");
// var axios = require("axios");

app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

var db = require("./models");
var PORT = process.env.PORT || 3000;


// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// Database configuration




// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapehome"

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });



////////////////////////////////CREATING ROUTES FOR DISPLAYING DATA AND MOVING TO POINTS.////////////////////////////////////////////////
// Create a generate all function
// Retrieve data from the db
app.get("/all", function(req, res) {
  // Find all results from the scrapedData collection in the db
  db.Article.find({}, function(error, found) {
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
        db.Article.create({
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

app.get("/", function(req, res) {
  db.Article.find({})
  .then(function(dbarticles) {
    res.render("index", {
     msg: "Thank you for scraping!",
      article: dbarticles
    });
  });
});

app.get("/articles", function(req, res) {

  db.Article.find({}, function(error, found){
    if (error) {
      console.log(error)
    }
    else {
      console.log(found)
      res.json(found)
    
    }
  })


  // TODO: Finish the route so it grabs all of the articles
});

// Route for grabbing a specific Article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {

  db.Article.findOne(
    {
    _id: req.params.id
  })
  .populate("note")
  .then(function(dbArticle) {
    res.json(dbArticle)
  })
  .catch(function(err) {
    res.json(err)
  })
  
  // TODO
  // ====
  // Finish the route so it finds one article using the req.params.id,
  // and run the populate method with "note",
  // then responds with the article with the note included
});

// Route for saving/updating an Article's associated Note
app.post("/articles/:id", function(req, res) {

  db.Note.create(req.body)

  .then(function (dbNote) {
    // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
    // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
    // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
    // return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    return db.Article.findOneAndUpdate({
      _id: req.params.id
    }, {
      
        note: dbNote._id
      
    }, {
      new: true
    });
  })
  // GET RID OF THIS FOR IT TO STAY ON SCREEN
  .then(function(dbArticle) {
    // If we were able to successfully update an Article, send it back to the client
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
  // TODO
  // ====
  // save the new note that gets posted to the Notes collection
  // then find an article from the req.params.id
  // and update it's "note" property with the _id of the new note
});

// app.delete("/articles/:id", function (req, res) {
//   db.Article.findByIdAndRemove({
// _id: request.params.id
//   }), function(error) {
//     if (error) console.log("error deleting note", error)
//     response.send()
//   }
// })

app.delete("/articles/:id", function (req, res) {
  db.Note.deleteOne(req.body)
  .then(function (dbNote) {
    return db.Article.findOneAndUpdate({
      _id: req.params.id
    }, {
      
        note: dbNote._id
      
    }, {
      new: true
    });
  }).then(function(dbArticle) {
    // If we were able to successfully update an Article, send it back to the client
    res.json(dbArticle);
  })
  .catch(function(err) {
    // If an error occurred, send it to the client
    res.json(err);
  });
});
////////////////////////////////////////////////CREATE THE LISTENING SERVER////////////////////////////////////////////////////////////////
// Start the server


app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
