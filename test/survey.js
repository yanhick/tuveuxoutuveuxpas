'use strict';

var sinon = require('sinon');
var chai = require('chai');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var shortId = require('shortid');

var surveyFactory = require('../lib/survey');

describe('survey', function () {
    var survey, findStub, getStub, insertStub, updateStub;

    beforeEach(function () {
        findStub = sinon.stub();
        getStub = sinon.stub();

        insertStub = sinon.stub();
        insertStub.callsArg(1);

        updateStub = sinon.stub();
        updateStub.callsArg(1);

        getStub.returns({
            find: findStub,
            insert: insertStub,
            update: updateStub
        });

        survey = surveyFactory({
            get: getStub
        });

        var shortIdStub = sinon.stub(shortId, 'generate');
        shortIdStub.returns('abcd');
    });

    afterEach(function () {
        shortId.generate.restore();
    });

    describe('#create', function () {

        it('should create a new survey', function (done) {
            survey.create('my question', function (err, doc) {
                if (err) done(err);

                expect(insertStub).to.have.been.calledWith({
                    key: 'abcd',
                    survey: 'my question',
                    answers: []
                });
                done();
            });
        });
    });

    describe('#addAnswer', function () {
        var surveyGetStub;

        beforeEach(function () {
            surveyGetStub = sinon.stub(survey, 'get');
            surveyGetStub.callsArgWith(1, null, {
                survey: 'my question',
                key: 'abcd',
                answers: []
            });
        });

        afterEach(function () {
            survey.get.restore();
        });

        it('should add an answer to the survey', function (done) {
            survey.addAnswer('abcd', {name: 'me', answer: true}, function (err, done) {
                if (err) done(err);

                expect(getStub).to.have.been.calledWith('abcd', sinon.match.func);
                done();
            });
        });
    });

    describe('#get', function () {
        it('should fetch an existing survey', function () {

        });
    });
});
