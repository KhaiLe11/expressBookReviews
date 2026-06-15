const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
      });
      return validusers.length > 0;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
    }
  
    if (authenticatedUser(username, password)) {
      // Generate JWT access token valid for 1 hour
      let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 3000 });
  
      // Store token and username in session authorization object
      req.session.authorization = { accessToken, username }
      
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(282).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    
    const username = req.session.authorization?.username;
  
    if (!review) {
      return res.status(400).json({ message: "Review query parameter is required" });
    }
  
    if (books[isbn]) {
      books[isbn].reviews[username] = review;
      
      return res.status(200).json({ 
        message: `The review for the book with ISBN ${isbn} has been successfully added/updated.` 
      });
    } else {
      return res.status(404).json({ message: "Book not found" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (books[isbn].reviews && books[isbn].reviews[username]) {
    // Surgically delete only this user's review key from the reviews object
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review successfully deleted" });
  } else {
    return res.status(400).json({ message: `No review found for ISBN ${isbn} under user ${username}` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
