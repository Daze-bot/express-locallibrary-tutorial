const BookInstance = require('../models/bookInstance');
const asyncHandler = require('express-async-handler');

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
  res.send("NOT IMPLEMENTED: BookInstance create GET");
});

exports.bookinstance_create_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: BookInstance create POST");
});

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