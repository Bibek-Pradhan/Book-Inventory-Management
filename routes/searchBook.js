// Import the Express module and create a router instance
const app = require('express');
const router = app.Router();
// Import the database connection module
const db = require("../db/database");

// Route for searching books by title
router.post("/search-title", (req, res) => {
    let data = req.body.title; // Retrieve the title from the request body
    let searchList = []; // Initialize an array to hold search results

    // SQL query to search for books with titles that match the given input
    var sql = `SELECT * FROM Inventory where Title LIKE '%${data}%';`

    // Execute the SQL query
    db.query(sql, function(err, result) {
        if (err) throw err; // Handle any errors that occur during the database query

        searchList = result; // Store the search results
        // Render the 'search' view with the results and the original search data
        res.render("search", { searchList, data });
    });
});

// Route for searching books by author
router.post("/search-author", (req, res) => {
    let data = req.body.author; // Retrieve the author from the request body
    let searchList = []; // Initialize an array for search results

    // SQL query to search for books by the specified author
    var sql = `SELECT * FROM Inventory where Author LIKE '%${data}%';`

    // Execute the SQL query
    db.query(sql, function(err, result) {
        if (err) throw err; // Handle any errors from the query
        searchList = result; // Store the search results
        // Render the 'search' view with the results and the original search data
        res.render("search", { searchList, data });
    });
});

// Route for searching books by genre
router.post("/search-genre", (req, res) => {
    let data = req.body.genre; // Retrieve the genre from the request body
    let searchList = []; // Initialize an array for search results

    // SQL query to search for books by the specified genre
    var sql = `SELECT * FROM Inventory where Genre LIKE '%${data}%';`

    // Execute the SQL query
    db.query(sql, function(err, result) {
        if (err) throw err; // Handle any errors that occur during the database query
        searchList = result; // Store the search results
        // Render the 'search' view with the results and the original search data
        res.render("search", { searchList, data });
    });
});

// Export the router to be used in other modules
module.exports = router;