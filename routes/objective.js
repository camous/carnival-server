const express = require('express');
const app = express.Router();
var _ = require('lodash');

app.get('/:roundid/:team', function(req,res){
    var carnival = req.app.get('carnival');
    var roundid = req.params.roundid;
    var team = req.params.team;

    res.status(200).send(carnival.game.rounds[roundid-1].objectives[team]);
});

module.exports = app;