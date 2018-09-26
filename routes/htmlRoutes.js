let db = require("../models");

module.exports = function(app) {
    app.get("/", function(req, res) {
        db.Article.findAll({})
        .then(function(dbArticle) {
          res.render("index", {
            msg: "Thank you for scraping!",
            article: dbArticle
          });
        });
    });



    app.get("*", function(req, res) {
        res.render("404");
      });
    }; // end tag for module exports
