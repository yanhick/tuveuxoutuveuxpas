'use strict';

var shortId = require('shortid');

/**
 * CRUD operations on survey.
 * manipulate mongo db
 */
module.exports = function (db) {

    /**
     * fetch an existing survey by public key
     * or error
     */
    function get(key, done) {
        var surveys = db.get('surveys');
        surveys.find({key: key}, {}, function (err, docs) {
            if (err) return done('Could not read from db');
            if (docs.length === 0) return done('survey don\'t exists');

            done(null, docs[0]);
        });
    }

    /**
     * Create a new survey for the provided question
     */
    function create(question, done) {

        //pseudo unique key for survey
        var key = shortId.generate();

        var surveys = db.get('surveys');
        surveys.insert({
            key: key,
            survey: question,
            answers: []
        },
        function (err, survey) {
            if (err) return done('There was a problem writing to the database');
            done(null, survey);
        });
    }

    /**
     * Add an answer to an existing survey
     * or error if survey don't exist
     */
    function addAnswer(key, userAnswer, done) {
        get(key, function (err, survey) {
            if (err) return done(err);

            var surveys = db.get('surveys');
            //add an answer
            surveys.update(survey._id, {$push: {answers: userAnswer}},
            function (err, survey) {
                if (err) return done('Could not update answers');
                done(null, survey);
            });
        });
    }

    return {
        get: get,
        create: create,
        addAnswer: addAnswer
    }
}


