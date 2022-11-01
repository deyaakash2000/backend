const mongoose = require("mongoose");
const { Schema } = mongoose;
const notesSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref :'user'
  },
  title: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  roll: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("userInfo", notesSchema);
