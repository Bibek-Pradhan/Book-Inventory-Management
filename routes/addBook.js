const app = require('express');
const router = app.Router();
const db = require("../db/database");

// Function to validate ISBN-10 and ISBN-13
function isValidISBN(isbn) {
    // Remove any hyphens or spaces from the ISBN
    const cleanedISBN = isbn.replace(/[-\s]/g, '');

    // Check ISBN-10
    if (cleanedISBN.length === 10) {
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            if (!/[0-9]/.test(cleanedISBN[i])) return false; // Validate numeric digits
            sum += (i + 1) * parseInt(cleanedISBN[i]);
        }
        const lastChar = cleanedISBN[9];
        sum += lastChar === 'X' ? 10 : parseInt(lastChar); // Last character can be 'X' for 10
        return sum % 11 === 0; // Return true if divisible by 11
    }

    // Check ISBN-13
    else if (cleanedISBN.length === 13 && /^[0-9]+$/.test(cleanedISBN)) {
        let sum = 0;
        for (let i = 0; i < 13; i++) {
            sum += parseInt(cleanedISBN[i]) * (i % 2 === 0 ? 1 : 3); // 1 for even index, 3 for odd index
        }
        return sum % 10 === 0; // Return true if the total mod 10 is 0
    }

    return false; // Return false for any other case
}

router.get('/add-book', (req, res) => {
    res.render("addBook")
})

// Add new book with JSON response
router.post('/add', (req, res) => {
    const { title, author, genre, publicationDate, isbn } = req.body;

    // Validate the ISBN
    if (!isValidISBN(isbn)) {
        return res.status(400).json({ error: 'Invalid ISBN number' }); // Send error response
    }

    const sql = 'INSERT INTO Inventory (title, author, genre, publication_date, isbn) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [title, author, genre, publicationDate, isbn], (err) => {
        if (err) {
            return res.status(500).json({ error: 'Error adding book' }); // Send error response
        }
        res.status(200).json({ success: 'Book added successfully' }); // Send success response
    });
});


// edit book
router.get("/edit-book/:id", (req, res) => {
    let book = [];
    let id = req.params.id;

    const sql = 'SELECT * FROM Inventory WHERE Entry_ID = ?;';
    db.query(sql, [id], function(err, result) {
        if (err) throw err;
        book = result[0];
        res.render("editBook", { book });
    });
});


// update book
router.post("/update-book/:id", (req, res) => {
    const id = req.params.id;

    const { title, author, genre, publicationDate, isbn } = req.body;

    // Validate the ISBN
    if (!isValidISBN(isbn)) {
        return res.status(400).send('Invalid ISBN number');
    }

    const sql = 'UPDATE Inventory set title = ?, author = ?, genre = ?, publication_date = ?, isbn = ? where Entry_ID = ?;';
    db.query(sql, [title, author, genre, publicationDate, isbn, id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
})


module.exports = router