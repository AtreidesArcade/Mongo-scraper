// Make sure we wait to attach our handlers until the DOM is fully loaded.
$(document).ready(function () {

    // Save an article
    $(".homeBtn").on("click", function (event) {

        location.href = '/';
    });

    // Run scraper for New York Times
    $(".scrapeBtn").on("click", function (event) {

        
        $.ajax("/scrape", {
            type: "GET"
        }).then(function () {

            location.reload();
        });
    });

    // Save an article
    $(".saveBtn").on("click", function (event) {

        let _id = $(this).parents(".card").data("_id");
        //console.log("_id", _id)

        $.ajax({
            method: "PUT",
            url: "/api/saved/" + _id,
        }).then(function () {

            location.reload();
        })
    });

    // Show all saved articles
    $(".savedBtn").on("click", function (event) {

        location.href = '/saved';
    })

    // Clear all articles
    $(".clearBtn").on("click", function (event) {

        $.ajax({
            method: "DELETE",
            url: "/api/deleteAll/",
        }).then(function () {

            location.reload();
        })
    })

    // Delete saved articles
    $(".deleteBtn").on("click", function (event) {

        let _id = $(this).parents(".card").data("_id");
        //console.log("_id", _id)

        $.ajax({
            method: "DELETE",
            url: "/api/delete/" + _id,
        }).then(function () {

            location.reload();
        })
    })

    // Note Modal 
    $(".notesBtn").on("click", function (event) {

        let _id = $(this).parents(".card").data("_id");
        //console.log("_id", _id);

        // add Article id
        $("#article-id").text(_id);

        // Empty list and clear note input
        $('.list-group').empty();
        $('#new-note').val('');

        $.ajax({
            method: "GET",
            url: "/api/populateduser/" + _id,
        }).then(function (dbArticles) {

            dbArticles.forEach(element => {
                //console.log("element.id", element._id);

                for (const val of element.noteId) {
                    // console.log('val', val.body);

                    $(".list-group").append("<li class='list-group-item'>" + val.body + "<button type='button' class='btn btn-danger btn-sm deleteNoteBtn' data-dismiss='modal' data-id='" + element._id + "' data-noteid='" + val._id + "'>X</button></li>");
                }
            });
        })
    });

    // Save Note 
    $(".saveNoteBtn").on("click", function (event) {

        let articleId = $("#article-id").text();
        let newNote = $('#new-note').val();

        $.ajax({
            method: "POST",
            url: "/api/note/" + articleId + "/" + newNote
        })
    })

    // Delete Note
    $("body").on("click", '.deleteNoteBtn', function (event) {

        let _id = $(this).data("id");
        let _noteid = $(this).data("noteid");

        //console.log("_id", _id);
        //console.log("_noteid", _noteid);

        $.ajax({
            method: "DELETE",
            url: "/api/deleteNote/" + _id + "/" + _noteid
        })
    })
});
