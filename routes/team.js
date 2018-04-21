const express = require('express');
const app = express.Router();
var _ = require('lodash');

const teams = require('../modules/team');

/**
 * initial generation of teams
 */
app.post('/generate/:team', function (req,res, next){
    var team = req.params.team;
    var carnival = req.app.get('carnival');

    teams.dispatchTeamResources(carnival, team);

    res.status(200).send(_.pickBy(carnival.territories,'meta.count'));
    next();
});

app.get('/get/:team', function(req,res){
    var team = req.params.team;
    var carnival = req.app.get('carnival');

    var teamterritories = _.mapValues(_.pickBy(carnival.territories,(value, key) =>{
       return value.meta.team !== undefined && value.meta.team === team;
    }), (value,key)=>{
        return value.meta;
    });

    res.status(200).send(teamterritories);
});

app.get('/icons', function (req,res){
    var carnival = req.app.get('carnival');

    var icons = _.mapValues(carnival.game.teams, (value,key) => {
        return value.icon;
    });

    res.status(200).send(icons);
});

module.exports = app;