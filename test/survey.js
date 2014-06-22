
describe('survey', function () {
    describe('#create', function () {
        it('should create a new survey');
        it('should throw when can\'t create');
    });

    describe('#addAnswer', function () {
        it('should add an answer to the survey');
        it('should throw when can\t update');
    });

    describe('#get', function () {
        it('should fetch an existing survey');
        it('should throw for a non-existing survey');
    });
});
