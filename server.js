// Import all required npm libraries
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var path = require ('path');

// Sets up the Express App
var app = express();
var PORT = process.env.PORT || 3000;

// If deployed, use the deployed database. Otherwise use the local NYT Sports database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/nytTechnology";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Use morgan logger for logging requests
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Import routes and controllers and give the server access to them.
require("./routes/nytTechRoutes.js")(app);
require("./controllers/nytTechController.js")(app);

// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static('public'));

// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT);
});
