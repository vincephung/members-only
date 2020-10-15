var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: { type: String, required: true, minlength: 1 },
  lastName: { type: String, required: true, minlength: 1 },
  username: { type: String, required: true, minlength: 1 },
  password: { type: String, required: true, minlength: 1 },
  isAdmin: { type: Boolean, required: true },
  isMember: { type: Boolean, required: true },
  messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
});

//virtual for full name?
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('User', UserSchema);
