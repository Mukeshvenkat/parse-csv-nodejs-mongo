const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const db = require('../mongodb');

let userSchema = new Schema({
    firstname: { type: String, required: true , trim: true, unique: true },
    email: { type: String, match: /\S+@\S+\.\S+/, trim: true, required: true },
    dob: { type :String, trim: true, required: true },
    userType: { type: String, trim: true, required: true },
    gender: { type: String, trim: true },
    phone: { type: String, trim: true},
    address: { type: String, trim: true},
    state: { type: String, trim: true},
    zip: { type: String} 
});

let usersModel = db.model('users', userSchema);

module.exports = usersModel;