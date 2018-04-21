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

app.post('/resume/:session/:snapshot', function (req, res, next){
    var session = req.params.session;
    var snapshot = req.params.snapshot;

    var carnival = game.resume(session, snapshot);
    if(carnival === null){
        res.status(500).send('can\'t locate snapshot');
    } else {
        req.app.set('carnival', carnival);
        res.status(200).send('session #' + session + ' snapshot #' + snapshot + ' loaded');
    }

    next();
});


module.exports = app;