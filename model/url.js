const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

exports.urlSchema = new Schema({
  indexurl: {
    type: Number,
  },
  url: {
    type: String,
    lowercase: true,
    trim: true,
    required: 'Please supply url',
  },
});

// module.exports = mongoose.model('UrlCode', urlSchema);
