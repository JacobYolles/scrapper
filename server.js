var express = require('express')
var mongojs = require("mongojs");

var request = require("request");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

var exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
 

var bodyParser = require('body-parser')
const cheerio = require('cheerio')
const $ = cheerio.load('<h2 class="title">Hello world</h2>')
 
$('h2.title').text('Hello there!')
$('h2').addClass('welcome')
 
$.html()
var request = require('request');

// Database configuration
var databaseUrl = "scrapehome"
var collections = ["scrapedData"]

// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

mongoose.connect("mongodb://localhost/scraphomework", { useNewUrlParser: true });