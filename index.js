'use strict';

var express = require('express');
var bodyParser = require('body-parser');
var expressHbs = require('express3-handlebars');
var shortId = require('shortid');

//set up mongo connection
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/tuveux');

var server = express();

//set up handlebar templating
server.engine('hbs', expressHbs({extname:'hbs'}));
server.set('view engine', 'mustache');
server.set('views', __dirname + '/views');

//static file serving
server.use(express.static(__dirname + '/public'));

//parse POST request
server.use(bodyParser.urlencoded());

//return survey at the provided ID
server.get('/:id', function (req, res) {

    var surveys = db.get('surveys');
    surveys.find({key: req.params.id}, {}, function (err, docs) {
        if (err) return res.send('Could not read from db');

        //redirect to index if id don't exist
        if(docs.length === 0 ) return res.redirect('/');

        res.render('survey.hbs', docs[0]);
    });
});

//create a new survey
server.post('/survey', function (req, res) {

    //pseudo unique key for survey
    var key = shortId.generate();

    var surveys = db.get('surveys');
    surveys.insert({
        key: key,
        survey: req.body.survey,
        answers: []
    },
    function (err, doc) {
        if (err) return res.send('There was a problem writing to the database');
        res.redirect('/' + id);
    });
});

//answer a survey
server.post('/answer', function (req, res) {

    var key = req.body.key;
    var surveys = db.get('surveys');
    var answer = req.body.answer === 'yes';

    //find survey
    surveys.find({key: req.body.key}, {}, function (err, docs) {
        if (err) return res.send('Could not read from db');

        //add an answer
        surveys.update(docs[0]._id, {$push: {answers: {name: req.body.name, answer: answer}}
        },
        function (err, doc) {
            if (err) return res.send('Could not update doc');
            res.redirect('/' + key);
        });
    });
});

//start server
server.listen(3000);
