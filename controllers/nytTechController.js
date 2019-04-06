var nytTechModel = require('../models/nytTechModel.js');

module.exports = function (app) {

  
    app.get('/scrape', nytTechModel.scrape);

    
    app.put('/api/saved/:id', nytTechModel.save);

 
    app.delete('/api/delete/:id', nytTechModel.delete);

    
    app.delete('/api/deleteAll/', nytTechModel.deleteAll);

  
    app.get('/api/populateduser/:id', nytTechModel.populateNotes);


    app.post('/api/note/:id/:addedNote', nytTechModel.addedNote);

    
    app.delete('/api/deleteNote/:id/:noteid', nytTechModel.deleteNote);
};
