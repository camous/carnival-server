const express = require('express');
const app = express.Router();
var _ = require('lodash');
var fs = require('fs');

app.post('/reset', function (req, res){
    var carnival = JSON.parse(fs.readFileSync('carnival.json', 'utf8'));
    req.app.set('carnival', carnival);
});

module.exports = app;