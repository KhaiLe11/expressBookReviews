const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Pleaser enter your username and password are required"});
  }

  // Check if username already exists in the users array
  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({message: "Username already exists"});
  }

  // Add the new user to the shared array
  users.push({"username": username, "password": password});
  return res.status(200).json({message: "You have successfully registered! Now you can login"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const keys = Object.keys(books);
    const matchedBooks = [];
  
    for (let i = 0; i < keys.length; i++) {
      if (books[keys[i]].author === author) {
        matchedBooks.push(books[keys[i]]);
      }
    }
  
    res.send(JSON.stringify(matchedBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
        let book = [];
        Object.keys(books).forEach(i => {
            if(books[i].title.toLowerCase() == title.toLowerCase()){
                book.push(books[i])
            }
        });
        res.send(book)
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

module.exports.general = public_users;
