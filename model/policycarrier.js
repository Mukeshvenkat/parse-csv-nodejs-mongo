const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const db = require('../mongodb');

let policyCarrierSchema = new Schema({
    company_name: { type: String, required: true, unique: true }
});

let policyCarrierModel = db.model('policycarrier', policyCarrierSchema);

module.exports = policyCarrierModel;