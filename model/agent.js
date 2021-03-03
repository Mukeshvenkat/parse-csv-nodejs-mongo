const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const db = require('../mongodb');

let agentSchema = new Schema({
    agent: { type: String, trim: true, required: true, unique: true }
});

let agentModel = db.model('agent', agentSchema);

module.exports = agentModel;