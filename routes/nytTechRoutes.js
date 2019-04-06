var nytTechModel = require('../models/nytTechModel.js');

module.exports = function (app) {
    
    /*
     * GET
     */
    app.get('/', nytTechModel.load);

    /*
     * GET
     */
    app.get('/saved', nytTechModel.saved);
};
