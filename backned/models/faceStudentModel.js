const mongoose = require("mongoose");

const faceStudentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  faceDescriptor: {
    type: [Number], // Number Array
    required: true,
    validate: {
      validator: (arr) => arr.every((num) => typeof num === "number"),
      message: "faceDescriptor must be an array of numbers.",
    },
  },
});

const FaceStudent = mongoose.model("FaceStudent", faceStudentSchema);

module.exports = FaceStudent;
