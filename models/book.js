const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "Author", required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

BookSchema.virtual("url").get(function () {
  return `/catalog/book/${this._id}`;
});

BookSchema.virtual("deleteBook").get(function () {
  return `/catalog/book/${this.id}/delete`;
});

BookSchema.virtual("updateBook").get(function () {
  return `/catalog/book/${this.id}/update`;
});

module.exports = mongoose.model("Book", BookSchema);
