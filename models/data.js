const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    default: 100
  },
  content: {
    type: String,
    required: true,
    maxlength: [30, "It's too long."],
    default: "這是一道題目"
  },
  hardness: {
    type: Number,
    max: [5, "It's out of range"],
    min: [1, "It's out of range"],
    default: 3
  },
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
