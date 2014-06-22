'use strict';

/**
 * Return poll results basd on users answers
 */
module.exports = function (answers) {
    //poll result. +1 for yes -1 for no
    var result = answers.reduce(function (acc, userAnswer) {
        return userAnswer.answer === true ? acc++ : acc--;
    }, 0);

    return {
        accepted: result > 0,
        refused: result < 0,
        equals: result === 0
    }
}

