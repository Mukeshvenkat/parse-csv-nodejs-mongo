const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const db = require('../mongodb');

let policySchema = new Schema({
    policy_number: { type: String, required: true , trim: true },
    policy_start_date: { type: String, trim: true },
    policy_end_date: { type :String, trim: true },
    category_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'policycategory',
        required: true
    },
    company_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'policycarrier',
        required: true
    },
    firstname: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

let policyModel = db.model('policy', policySchema);

module.exports = policyModel;