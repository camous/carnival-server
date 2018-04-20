const express = require('express');
const app = express.Router();
var _ = require('lodash');

const teams = require('../modules/team');

/**
 * initial generation of teams
 */
app.post('/generate/:team', function (req,res){
    var team = req.params.team;
    var carnival = req.app.get('carnival');

    teams.dispatchTeamResources(carnival, team);

    res.status(200).send(_.pickBy(carnival.territories,'meta.count'));
});

module.exports = app;