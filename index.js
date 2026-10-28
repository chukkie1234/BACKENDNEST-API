const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Book = require("./models/Book");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Middleware

  // Log every incoming request
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });
// Port
const PORT = process.env.PORT || 3000;



// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to BookNest API");
});

// Get books with pagination
app.get("/api/books", async (req, res) => {
  try {
    const page = req.query.page === undefined
      ? 1
      : Number(req.query.page);

    const limit = req.query.limit === undefined
      ? 2
      : Number(req.query.limit);

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1
    ) {
      return res.status(400).json({
        message: "Page and limit must be positive whole numbers"
      });
    }

    const search = req.query.search;
    const searchFilter = {};

    if (search) {
       searchFilter.$or = [
           { title: { $regex: search, $options: "i" } },
           { author: { $regex: search, $options: "i" } }
       ];
    }

      const startIndex = (page - 1) * limit;

      const totalBooks = await Book.countDocuments(searchFilter);

      const paginatedBooks = await Book.find(searchFilter)
          .skip(startIndex)
          .limit(limit);

    res.json({
      page,
      limit,
      totalBooks,
      totalPages: Math.ceil(totalBooks / limit),
      books: paginatedBooks
    });

  } catch (error) {
    console.error("GET /api/books error:", error);
    res.status(500).json({
      message: "Failed to retrieve books",
      error: error.message
    });
  }
});

// Search books by title or author
app.get("/api/books/search", async (req, res) => {
  try {
    const { title, author } = req.query;
    const searchFilter = {};
    if (title) {
      searchFilter.title = {
        $regex: title,
        $options: "i"
      };
    }
    if (author) {
      searchFilter.author = {
        $regex: author,
        $options: "i"
      };
    }
    const results = await Book.find(searchFilter);
    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Failed to search books",
      error: error.message
    });
  }
});

// Get a single book by ID
app.get("/api/books/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({
        message: "Book ID must be a positive whole number"
      });
    }

    const book = await Book.findOne({ id: id });

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve book",
      error: error.message
    });
  }
});

// Create a new book
app.post("/api/books", async (req, res) => {
  try {
    const { title, author } = req.body;

    if (!title || !author) {
      return res.status(400).json({
        message: "Title and author are required"
      });
    }

    const newBook = await Book.create({
      id: Date.now(),
      title,
      author
    });

    res.status(201).json({
      message: "Book created successfully",
      book: newBook
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create book",
      error: error.message
    });
  }
});


// Update only part of a book using PATCH
app.patch("/api/books/:id", async (req, res) => {
  try {
    const bookId = Number(req.params.id);
    const { title, author } = req.body;

    if (!Number.isSafeInteger(bookId) || bookId <= 0) {
      return res.status(400).json({
        message: "Invalid book ID"
      });
    }

    if (title === undefined && author === undefined) {
      return res.status(400).json({
        message: "Please provide title or author to update"
      });
    }

    const book = await Book.findOne({ id: bookId });

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    if (title !== undefined) {
      book.title = title;
    }

    if (author !== undefined) {
      book.author = author;
    }

    await book.save();

    res.json({
      message: "Book updated successfully",
      book: book
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update book",
      error: error.message
    });
  }
});

    // Update book by ID
    app.put("/api/books/:id", async (req, res) => {
      try {
        const bookId = Number(req.params.id);

    // Validate book ID
    if (!Number.isSafeInteger(bookId) || bookId <= 0) {
      return res.status(400).json({
        message: "Invalid book ID"
      });
    }

    const { title, author } = req.body;

    // Find the book in MongoDB Atlas
    const book = await Book.findOne({ id: bookId });

    if (!book) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    // Validate required fields
    if (!title || !author) {
      return res.status(400).json({
        message: "Title and author are required"
      });
    }

    // Update the book
    book.title = title;
    book.author = author;

    await book.save();

    res.json({
      message: "Book updated successfully",
      book: book
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update book",
      error: error.message
    });
  }
});


// Delete a book by ID from MongoDB
app.delete("/api/books/:id", async (req, res) => {
  try {
    const bookId = Number(req.params.id);

    if (!Number.isSafeInteger(bookId) || bookId <= 0) {
      return res.status(400).json({
        message: "Invalid book ID"
      });
    }

    const deletedBook = await Book.findOneAndDelete({
      id: bookId
    });

    if (!deletedBook) {
      return res.status(404).json({
        message: "Book not found"
      });
    }

    res.json({
      message: "Book deleted successfully",
      book: deletedBook
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete book",
      error: error.message
    });
  }
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: "Internal Server Error"
  });
});

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Atlas connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

// Start server
app.listen(PORT, () => {
  console.log(`BookNest API is running on port ${PORT}`);
});

