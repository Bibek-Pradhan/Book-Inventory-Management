// Import required modules
const express = require('express'); // Framework for building web applications
const app = express(); // Create an instance of Express
const db = require("./db/database"); // Import the database connection module
const bodyParser = require('body-parser'); // Middleware to parse incoming request bodies

const PORT = 3000; // Define the port number for the server

// Set EJS as the templating engine for rendering views
app.set('view engine', 'ejs');
// Serve static files from the 'public' directory
app.use(express.static('public'));
// Middleware to parse JSON and URL-encoded data from incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Handle GET requests to the root URL
app.get('/', (req, res) => {
    // Get the current page number from the query parameters, defaulting to 1
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 5; // Define how many items to display per page
    const start = (page - 1) * itemsPerPage; // Calculate the starting index for pagination

    const sql = 'SELECT * from Inventory'; // SQL query to fetch all books from the inventory
    db.query(sql, function(err, result) {
        if (err) throw err; // Handle any errors that occur during the database query
        const books = result; // Store the fetched books
        const totalPages = Math.ceil(books.length / itemsPerPage); // Calculate total pages for pagination

        // Render the index page with the current books slice, current page, and total pages
        res.render('index', { books: books.slice(start, start + itemsPerPage), currentPage: page, totalPages });
    });
});

// Route handlers for additional functionalities: adding, deleting, exporting, and searching books
app.use("/", require("./routes/addBook"));
app.use("/", require("./routes/deleteBook"));
app.use("/", require("./routes/exportBook"));
app.use("/", require("./routes/searchBook"));

// Handle 404 Not Found for any unspecified routes
app.get("*", (req, res) => {
    res.send("Page Not Found!");
});

// Start the server and listen on the defined port
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`); // Log the server URL to the console
});