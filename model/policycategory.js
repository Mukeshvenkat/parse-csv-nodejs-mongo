const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const db = require('../mongodb');

let policyCategorySchema = new Schema({
    category_name: { type: String, trim: true, required: true, unique: true }
});

let policyCategoryModel = db.model('policycategory', policyCategorySchema);

module.exports = policyCategoryModel;