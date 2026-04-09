const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (username && password) {
    if (!isValid(username)) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Tarea 1 y 10: Obtener lista de libros
public_users.get('/', function (req, res) {
  new Promise((resolve) => {
    resolve(books);
  }).then((booksList) => res.status(200).send(JSON.stringify(booksList, null, 4)));
});

// Tarea 2 y 11: Obtener por ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (books[isbn]) resolve(books[isbn]);
    else reject({ message: "Book not found" });
  }).then((book) => res.status(200).send(book))
    .catch((err) => res.status(404).send(err));
});

// Tarea 3 y 12: Obtener por Autor
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve) => {
    let filtered = Object.values(books).filter(b => b.author === author);
    resolve(filtered);
  }).then((result) => res.status(200).send(result));
});

// Tarea 4 y 13: Obtener por Título
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve) => {
    let filtered = Object.values(books).filter(b => b.title === title);
    resolve(filtered);
  }).then((result) => res.status(200).send(result));
});

// Tarea 5: Obtener Reseñas
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
