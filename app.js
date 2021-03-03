var express = require('express');
var bodyparser = require('body-parser');
const csvParsing = require('./csvParsing');

const PORT = 3000;
var app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use(bodyparser.json());

app.get('/csvparse', (request, response, next) => {
    csvParsing.parseCSVFile(request, response, next);
});

app.get('/policyinfo/:username', (request, response, next) => {
    csvParsing.getPolicyInfo(request, response, next);
});

app.listen(PORT);
