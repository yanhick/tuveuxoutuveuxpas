'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var expressHbs = require('express3-handlebars');

//set up mongo connection
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/tuveux');

var getResults = require('./lib/results');
var survey = require('./lib/survey')(db);

var server = express();

//set up handlebar templating
server.engine('hbs', expressHbs({extname:'hbs'}));
server.set('view engine', 'mustache');
server.set('views', __dirname + '/views');

//static file serving
server.use(express.static(__dirname + '/public'));

//parse POST request
server.use(bodyParser.urlencoded());

//return survey at the provided key
server.get('/:key', function (req, res) {

    survey.get(req.params.key, function (err, survey) {
        //redirect to index if key doesn't exist
        if (err) return res.redirect('/');

        //add poll results
        survey.poll = getResults(survey.answers);
        res.render('survey.hbs', survey);
    });
});

//create a new survey
server.post('/survey', function (req, res) {

    survey.create(req.body.survey, function (err, survey) {
        if (err) res.send(err);
        res.redirect('/' + survey.key);
    });
});

//answer a survey
server.post('/answer', function (req, res) {

    var key = req.body.key;
    var surveys = db.get('surveys');
    var answer = req.body.answer === 'yes';

    survey.addAnswer(key, {name: req.body.name, answer: answer}, function (err, survey) {
        if (err) return res.send(err);

        res.redirect('/' + key);
    });
});

//start server
server.listen(process.env.PORT || 3000);
