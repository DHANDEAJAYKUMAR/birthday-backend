const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: String,
  description: String,
  photoUrl: String,
  uniqueLink: String
});

module.exports = mongoose.model('Student', studentSchema);
