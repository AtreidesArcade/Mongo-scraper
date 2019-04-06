var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var NoteSchema = new Schema({
  body: String
});

module.exports = mongoose.model("Note", NoteSchema);
