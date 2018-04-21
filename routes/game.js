const express = require('express');
const app = express.Router();
var _ = require('lodash');
var fs = require('fs');

const game = require('../modules/game');

app.post('/reset', function (req, res, next){
    var carnival = game.reset();
    req.app.set('carnival', carnival);

    res.status(200).send('ok');
    next();
});


module.exports = app;