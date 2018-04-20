const express = require('express');
const app = express.Router();
var _ = require('lodash');

app.get('/get', function (req, res){
    var carnival = req.app.get('carnival');

    var results = _.mapValues(carnival.territories, function (value, key){
        return value.meta;
    });

    res.status(200).send(results);
});

module.exports = app;