const mongoose = require('mongoose');
const moment = require('moment');

const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

AuthorSchema.virtual("name").get(function () {
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

AuthorSchema.virtual("url").get(function () {
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("lifespan").get(function () {
  if (this.date_of_death && this.date_of_birth) {
    return moment(this.date_of_birth).format('YYYY') + " - " + moment(this.date_of_death).format('YYYY');
  } else if (this.date_of_birth) {
    return moment(this.date_of_birth).format('YYYY') + " - ";
  } else if (this.date_of_death) {
    return " - " + moment(this.date_of_death).format('YYYY');
  } else {
    return " - ";
  }
});

AuthorSchema.virtual("deleteAuthor").get(function () {
  return `/catalog/author/${this.id}/delete`;
})

module.exports = mongoose.model("Author", AuthorSchema);
