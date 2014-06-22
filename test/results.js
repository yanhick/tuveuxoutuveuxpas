'use strict';

var sinon = require('sinon');
var expect = require('chai').expect;

var getResults = require('../lib/results');

describe('poll result', function () {
    it('should return a positive poll', function () {
        var results = getResults([{
            name: 'me',
            answer: true
        }]);

        expect(results).to.eql({
            accepted: true,
            refused: false,
            equals: false
        });
    });
    it('should return a negative poll', function () {
        var results = getResults([{
            name: 'me',
            answer: false
        }]);

        expect(results).to.eql({
            accepted: false,
            refused: true,
            equals: false
        });

    });
    it('should return an equal poll', function () {
        var results = getResults([{
            name: 'me',
            answer: false
        }, {
            name: 'you',
            answer: true
        }]);

        expect(results).to.eql({
            accepted: false,
            refused: false,
            equals: true
        });
    });
});
