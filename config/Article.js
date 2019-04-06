var mongoose = require('mongoose');

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

// create a new UserSchema object
var ArticleSchema = new Schema({

	headline: {
		type: String,
		unique: true
	},
	summary: {
		type: String,
		unique: true
	},
	url: {
		type: String,
		unique: true
	},
	photoURL: {
		type: String,
		unique: true
	},
	saved: {
		type: Boolean
	},

	noteId: [
		{
			type: Schema.Types.ObjectId,
			ref: "Note"
		}
	]
});

module.exports = mongoose.model('Article', ArticleSchema);
