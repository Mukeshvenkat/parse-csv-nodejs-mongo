const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const db = require('../mongodb');

let userAccountSchema = new Schema({
    account_name: { type: String, required: true, unique: true }
});

let userAccountModel = db.model('useraccount', userAccountSchema);

module.exports = userAccountModel;