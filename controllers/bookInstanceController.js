const BookInstance = require('../models/bookInstance');
const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const Book = require('../models/book');
const unescape = require('../middleware/unescape');

exports.bookinstance_list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find()
    .populate("book")
    .exec();

  res.render('base', {
    title: "Book Instance List",
    blockContent: "book_instance_list",
    book_instance_list: allBookInstances,
  })
});

exports.bookinstance_detail = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate({
      path: 'book',
      populate : {
        path: 'author'
      }
    })
    .exec();

  if (bookInstance === null) {
    const err = new Error("Book copy not found");
    err.status = 404
    return next(err);
  }

  res.render('base', {
    blockContent: "book_instance_detail",
    title: "Book Instance",
    book_instance: bookInstance,
  })
});

exports.bookinstance_create_get = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

  const allStatus = [
    { name: "Maintenance" },
    { name: "Available" },
    { name: "Loaned" },
    { name: "Reserved" },
  ];

  res.render('base', {
    blockContent: "book_instance_form",
    title: "Create Book Instance",
    book_list: allBooks,
    book_instance: "",
    errors: undefined,
    statuses: allStatus,
  });
});

exports.bookinstance_create_post = [
  body("book", "Book must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("imprint", "Imprint must be specified")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .unescape("&#x27;", "'"),
  body("status").escape(),
  body("due_back", "Invalid date")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      const allBooks = await Book.find({}, "title").sort({ title: 1 }).exec();

      const allStatus = [
        { name: "Maintenance" },
        { name: "Available" },
        { name: "Loaned" },
        { name: "Reserved" },
      ];

      allStatus.forEach(status => {
        if (bookInstance.status === status.name) {
          status.selected = "true";
        } else {
          status.selected = "false";
        }
      })

      res.render('base', {
        blockContent: "book_instance_form",
        title: "Create Book Instance",
        book_list: allBooks,
        selected_book: bookInstance.book._id,
        errors: errors.array(),
        book_instance: bookInstance,
        statuses: allStatus,
      });
      return;
    } else {
        await bookInstance.save();
        res.redirect(bookInstance.url);
    }
  }),
];

exports.bookinstance_delete_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete GET");
});

exports.bookinstance_delete_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance delete POST");
});

exports.bookinstance_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update GET");
});

exports.bookinstance_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance update POST");
});