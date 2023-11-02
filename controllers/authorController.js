const Author = require('../models/author');
const Book = require('../models/book');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();
  res.render('base', {
    title: "Author List",
    blockContent: "author_list",
    author_list: allAuthors,
  });
});

exports.author_detail = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render('base', {
    blockContent: "author_detail",
    title: "Author Detail",
    author: author,
    author_books: allBooksByAuthor,
  });
});

exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.render('base', {
    blockContent: "author_form",
    title: "Create Author",
    author: "",
    errors: undefined,
  });
});

exports.author_create_post = [
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name is required"),
  body("last_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Last name is required"),
  body("date_of_birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate()
    .withMessage("Invalid date of birth"),
  body("date_of_death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate()
    .withMessage("Invalid date of death"),
  
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.last_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      res.render('base', {
        blockContent: "author_form",
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      const authorExists = await Author.findOne({ 
        first_name: req.body.first_name,
        family_name: req.body.last_name
      }).collation({ locale: "en", strength: 2 }).exec();
      if (authorExists) {
        res.redirect(authorExists.url);
      } else {
        await author.save();
        res.redirect(author.url);
      }
    }
  }),
];

exports.author_delete_get = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (author === null) {
    res.redirect("/catalog/authors");
  }

  res.render('base', {
    blockContent: "author_delete",
    title: "Delete Author",
    author: author,
    author_books: allBooksByAuthor,
  })
});

exports.author_delete_post = asyncHandler(async (req, res, next) => {
  const [author, allBooksByAuthor] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, "title summary").exec(),
  ]);

  if (allBooksByAuthor > 0) {
    res.render('base', {
      blockContent: "author_delete",
      title: "Delete Author",
      author: author,
      author_books: allBooksByAuthor,
    });
    return;
  } else {
    await Author.findByIdAndRemove(req.body.author._id);
    res.redirect("/catalog/authors");
  }
});

exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
});

exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST");
});