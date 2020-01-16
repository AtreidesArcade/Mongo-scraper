var cheerio = require("cheerio");
var axios = require("axios");

var ObjectId = require('mongoose').Types.ObjectId;
var db = require("../config");

module.exports = {

     load: function (req, res) {

        db.Article.find({ saved: false })
            .then(function (dbArticle) {

                if (dbArticle.length == 0) {
                    res.render("noArticles");
                }
                else {
                    console.log(dbArticle)
                    res.render("index", { dbArticle });
                }
            })
            .catch(function (err) {
                res.json(err);
            });
    },

      scrape: function (req, res) {

        axios.get("https://www.nytimes.com/section/technology").then(function (response) {

            // Load the Response into cheerio and save it to a variable
            var $ = cheerio.load(response.data);

            // An empty array to save the data that we'll scrape
            var results = [];

            // With cheerio, find each p-tag with the "title" class
            $("div.css-4jyr1y").each(function (i, element) {

                // Get Headline
                var headline = $(element).find(".css-1dq8tca").text();

                // Get Summary
                var summary = $(element).find(".css-1echdzn").text();

                // Get URL
                var url = "https://www.nytimes.com/section/technology" + $(element).children().attr("href");

                // Photo URL
                let photoURL = $(element).find(".css-11cwn6f").attr("src");

                results.push({
                    headline: headline,
                    summary: summary,
                    url: url,
                    photoURL: photoURL,
                    saved: false
                });
            });

            db.Article.create(results)
                .then(function (dbArticle) {


                    res.render("index");
                })
                .catch(function (err) {

                    console.log(err);
                });
        });
    },

    save: function (req, res) {
        var id = req.params.id;

        db.Article.update({ _id: id }, { $set: { saved: true } }, function (err, dbArticle) {

            res.render("index", { dbArticle });
        })
            .catch(function (err) {
                res.json(err);
            });
    },

      saved: function (req, res) {

        db.Article.find({ saved: true })
            .then(function (dbArticle) {

                //console.log("dbArticle", dbArticle)

                if (dbArticle.length > 0) {
                    res.render("savedArticles", { dbArticle });
                }
                else {
                    res.render("noSavedArticles");
                }
            })
            .catch(function (err) {
                res.json(err);
            });
    },

     deleteAll: function (req, res) {

        db.Article.remove({})
            .then(function (dbArticle) {


                res.render("noArticles");
            })
            .catch(function (err) {
                res.json(err);
            });
    },


       
    delete: function (req, res) {
        var id = req.params.id;

        db.Article.remove({ _id: id })
            .then(function (dbArticle) {


                if (dbArticle.length > 0) {

                    res.render("savedArticles", { dbArticle });
                }
                else {
                    res.render("index", { dbArticle });
                }
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    },

      populateNotes: function (req, res) {
        var id = req.params.id;

        // Find all Articles
        db.Article.find({ _id: id })
            // Specify that we want to populate the retrieved Articles with any associated notes
            .populate("noteId")
            .then(function (dbArticles) {
                res.json(dbArticles);
            })
            .catch(function (err) {
                res.json(err);
            });
    },

    
    addedNote: function (req, res) {
        var id = req.params.id;
        var addedNote = req.params.addedNote;

        // console.log("id", id)
        // console.log("addedNote", addedNote)

        db.Note.create({ body: addedNote })
            .then(function (dbNote) {

                console.log("dbNote", dbNote)

                // push each note id into an array on Article
                return db.Article.update({ _id: id }, { $push: { noteId: dbNote._id } }, { new: true })
            })
            .then(function (dbUser) {

                //console.log("dbUser", dbUser)

                // Send a message to the client
                res.render("savedArticles");

            }).catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    },

    /**
     * nytTechModel.deleteNote()
     */
    deleteNote: function (req, res) {
        var id = req.params.id;
        var noteid = req.params.noteid;

        console.log("id", id)
        console.log("noteid", noteid)

        db.Note.remove({ _id: noteid })
            .then(function (dbNote) {

                // push each note id into an array on Article
                return db.Article.update({ _id: id }, { $pull: { "noteId": new ObjectId(noteid) }})
            }).then(function (dbUser) {

                res.render("savedArticles");
            })
            .catch(function (err) {
                res.json(err);
            });
    }
};
