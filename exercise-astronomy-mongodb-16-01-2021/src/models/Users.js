const mongoose = require("mongoose");
const { Schema } = mongoose;
const DEFAULT_BADGES = require('../constants/feats');

const UsersSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  nickname: String, 
  affiliatedNumber: {
    type: Number,
    required: true,
  },
  age: Number,  
  affiliationDate: Date, 
  occupation: String, 
  birthdate: Date, 
  deleted: Boolean, 
  astronomicalPoints: Number,
  neasDiscovered: [String], 
  necsDiscovered: [String], 
  badges: [
    { name: String, given: Boolean, info: String, points: Number },
  ]
});

// Esta function no debe ser flecha para no perder el scope del modelo
UsersSchema.pre('save', function (next) {
  this.badges = DEFAULT_BADGES;
  this.deleted = false;
  this.astronomicalPoints = 0
  next();
});

const model = mongoose.model("Users", UsersSchema);

module.exports = model;
