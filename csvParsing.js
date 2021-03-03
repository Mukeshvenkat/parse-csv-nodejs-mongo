const csv = require('csv-parser');
const fs = require('fs');

const usersModel = require('./model/user');
const agentModel = require('./model/agent');
const policyCategoryModel = require('./model/policycategory');
const policyCarrierModel = require('./model/policycarrier');
const userAccountModel = require('./model/useraccount');
const policyModel = require('./model/policy');

const filepath = "./data-sheet.csv";

let csvData = [];

let policyCategoryMap = {};
let policyCarrierMap = {};
let userMap = {};
let userAccountMap = {};
let agentMap = {};
let policyMap = {};

let csvParsing = {
    insertUser: async (data) => {
        if (!userMap.hasOwnProperty(data['firstname'])) {
            await new usersModel(data).save().then(function (userData) {
                userMap[userData.firstname] = userData._id;
            });
        }
    },

    insertPolicyCategory: async (data) => {
        if (!policyCategoryMap.hasOwnProperty(data['category_name'])) {
            await new policyCategoryModel(data).save().then(function (policyCategoryData) {
                policyCategoryMap[policyCategoryData.category_name] = policyCategoryData._id;
            });
        }
    },

    insertPolicyCarrier: async (data) => {
        if (!policyCarrierMap.hasOwnProperty(data['company_name'])) {
            await new policyCarrierModel(data).save().then(function (policyCarrierData) {
                policyCarrierMap[policyCarrierData.company_name] = policyCarrierData._id;
            });
        }
    },

    insertAgent: async (data) => {
        if (!agentMap.hasOwnProperty(data['agent'])) {
            await new agentModel(data).save().then(function (agentData) {
                agentMap[agentData.agent] = agentData._id;
            });
        }
    },

    insertUserAccount: async (data) => {
        if (!userAccountMap.hasOwnProperty(data['account_name'])) {
            await new userAccountModel(data).save().then(function (userAccountData) {
                userAccountMap[userAccountData.account_name] = userAccountData._id;
            });
        }
    },

    insertPolicy: async (data) => {
        data['category_name'] = policyCategoryMap[data['category_name']];
        data['company_name'] = policyCarrierMap[data['company_name']];
        data['firstname'] = userMap[data['firstname']];
        await new policyModel(data).save().then(function (policyData) {
            policyMap[policyData.policy_number] = policyData._id;
        });
    },

    parseCSVFile: async (request, response) => {
        let csvFileParse = false;
        fs.createReadStream(filepath)
            .on('error', (err) => {
                console.log('Error :', err);
            })
            .pipe(csv())
            .on('data', (row) => {
                csvData.push(row);
            })
            .on('end', async (endData) => {
                csvFileParse = true;
                await csvParsing.insertData(csvFileParse);
            });
    },

    insertData: async (csvparse) => {
        if (csvparse) {
            for (var data in csvData) {
                if (csvData.hasOwnProperty(data)) {
                    await csvParsing.insertUser(csvData[data]);
                    await csvParsing.insertPolicyCategory(csvData[data]);
                    await csvParsing.insertPolicyCarrier(csvData[data]);
                    await csvParsing.insertUserAccount(csvData[data]);
                    await csvParsing.insertAgent(csvData[data]);
                    await csvParsing.insertPolicy(csvData[data]);
                }
            }
            await csvParsing.loadMaps();
        }
    },

    getPolicyInfo: async (request, response) => {
        const username = request.params.username;
        let policyInfo;
        
        const userId = await usersModel.findOne({ userName: username }).select('_id').exec().then(function (userData) {
            return userData != null || userData != undefined ? userData['_id'] : 0;
        }).catch(function (error) {
            throw new Error('Error while retrieving data :', error);
        });
        
        if (userId != 0) {
            policyInfo = await (await policyModel.findOne({ firstname: userId })).populate([{
                path: "category_name",
                model: "policycategory"
            },
            {
                path: "company_name",
                model: "policycarrier"
            },
            {
                path: "firstname",
                model: "users"
            }]).exec().then(function (policyData) {
                return policyData;
            }).catch(function (error) {
                throw new Error('Error while retrieving data :', error);
            });
        } else {
            console.log('User Not exist');
        }
        response.json({
            'status': 200,
            'data': policyInfo
        });
    }
}

module.exports = csvParsing;