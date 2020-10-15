var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema({
  title: { type: String, required: true, minlength: 1 },
  text: { type: String, required: true, minlength: 1 },
  timeStamp: { type: String, required: true, minlength: 1 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Message', MessageSchema);
