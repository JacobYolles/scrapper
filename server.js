var express = require('express')
var app = express()
var exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
 
mongoose.connect('mongodb://localhost/my_database');
var bodyParser = require('body-parser')
const cheerio = require('cheerio')
const $ = cheerio.load('<h2 class="title">Hello world</h2>')
 
$('h2.title').text('Hello there!')
$('h2').addClass('welcome')
 
$.html()
var request = require('request');