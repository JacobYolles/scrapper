let db = require("../models");

module.exports = function(app) {
    // app.get("/", function(req, res) {
    //     db.scraphomework.findAll({})
    //     .then(function(scraphomeworks) {
    //       res.render("index", {
    //         msg: "Thank you for scraping!",
    //         scraphomework: scraphomeworks
    //       });
    //     });
    // });



    app.get("*", function(req, res) {
        res.render("404");
      });
    }; // end tag for module exports
