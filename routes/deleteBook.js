// Import the Express module and create a router instance
const app = require('express');
const router = app.Router();
// Import the database connection module
const db = require("../db/database");

// Route to delete a book from the inventory by its ID
router.post("/delete-book/:id", (req, res) => {
    // Extract the book ID from the request parameters
    const id = req.params.id;

    // SQL query to delete the book with the specified Entry_ID
    const sql = 'DELETE FROM Inventory WHERE Entry_ID = ?';

    // Execute the SQL query with the provided ID
    db.query(sql, [id], function(err, result) {
        if (err) throw err; // Handle any errors during the query execution
        res.redirect("/"); // Redirect to the home page after successful deletion
    });
});

// Export the router for use in other modules
module.exports = router;