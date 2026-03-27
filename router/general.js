const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require("axios");
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  // Register a new user

    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    

    
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});


public_users.put("/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review, username } = req.body;

  // validation
  if (!review || !username) {
    return res.status(400).json({
      message: "Review and username are required"
    });
  }

  // check book exists
  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found"
    });
  }

  // add/update review
  books[isbn].reviews[username] = review;

  res.status(200).json({
    message: "Review added successfully",
    reviews: books[isbn].reviews
  });
});

public_users.delete("/deletereview/:isbn", (req, res) => {
  const { isbn } = req.params;

  // Check book exists
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  // Clear all reviews
  books[isbn].reviews = {};

  res.status(200).json({
    message: "All reviews deleted successfully",
    reviews: books[isbn].reviews
  });
});



// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
   res.send(JSON.stringify(books,null,4));
  //return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/list', async (req, res) => {
  try {
    const response = await axios.get("https://soniasingh73-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/"
    );

    const books = response.data;

    res.status(200).json(books);

  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get book details based on ISBN
/* public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn]);
  return res.status(300).json({message: "Yet to be implemented"});
 }); */
 public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    // Example API (replace with your actual API)
    const response = await axios.get("https://soniasingh73-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
    const books = response.data;
     res.send(books[isbn]);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching books" });
  }
});
  
// Get book details based on author
/* public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  result = [];
  for (let key in books){
    if(books[key].author === author){
        result.push(books[key].author);
    }
  }
  res.send(result);
  return res.status(300).json({message: "Yet to be implemented"});
}); */

public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;

    // Example API (replace with your actual API)
    const response = await axios.get("https://soniasingh73-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
    const books = response.data;

    // Filter books by title
    const result = Object.values(books).filter(
  (book) => book.author === author
);
    res.status(200).json(result);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Get all books based on title
/* public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  result = [];
  for (let key in books){
    if(books[key].title === title){

        result.push(books[key].title);
    } 
  }
  res.send(result);  
}); */

public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;

    // Example API (replace with your actual API)
    const response = await axios.get("https://soniasingh73-5000.theianext-0-labs-prod-misc-tools-us-east-0.proxy.cognitiveclass.ai/");
    const books = response.data;

    // Filter books by title
    const result = Object.values(books).filter(
  (book) => book.title === title
);
    res.status(200).json(result);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Error fetching books" });
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);

  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
