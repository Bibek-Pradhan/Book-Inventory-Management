// Import the Express module and create a router instance
const app = require('express');
const router = app.Router();
// Import the database connection module
const db = require("../db/database");
// Import the json2csv parser library to convert JSON data to CSV format
const { Parser } = require('json2csv');

// Route to export book data as a CSV file
router.get('/export-csv', (req, res) => {
    // SQL query to select specific columns from the Inventory table
    const sql = 'SELECT Entry_Id, Title, Author, Genre, Publication_Date, ISBN FROM Inventory';

    // Execute the SQL query to fetch data from the database
    db.query(sql, (err, results) => {
        if (err) {
            // If there's an error fetching data, respond with a 500 status code and an error message
            return res.status(500).send('Error fetching data');
        }

        // Create a new instance of the json2csv parser
        const json2csvParser = new Parser();
        // Convert the query results (JSON) to CSV format
        const csv = json2csvParser.parse(results);

        // Set the response header to indicate that the content is CSV
        res.header('Content-Type', 'text/csv');
        // Specify the filename for the CSV attachment
        res.attachment('books.csv');
        // Send the generated CSV as the response
        res.send(csv);
    });
});

// Export the router for use in other modules
module.exports = router;