const express = require('express');
const app = express.Router();
var _ = require('lodash');
const objectives = require('../modules/objective');

app.get('/:roundid/:team', function(req,res){
    var carnival = req.app.get('carnival');
    var roundid = req.params.roundid;
    var team = req.params.team;

    res.status(200).send(carnival.game.rounds[roundid-1].objectives[team]);
});

app.put('/:roundid/:team/:objectiveid?', function (req, res){
    var carnival = req.app.get('carnival');
    var objectiveid = req.params.objectiveid;
    var roundid = req.params.roundid;
    var team = req.params.team;

    var teamobjectives = carnival.game.rounds[roundid-1].objectives[team];

    // it's a new objective
    if(objectiveid === undefined){
        teamobjectives.push(req.body);
        objectiveid = teamobjectives.length-1;
    }else{
        teamobjectives[objectiveid] = req.body;
    }

    res.status(200).send(teamobjectives[objectiveid]);
});

app.get('/:roundid/:team/cost', function (req,res){
    var carnival = req.app.get('carnival');
    var roundid = req.params.roundid;
    var team = req.params.team;
    var teamobjectives = carnival.game.rounds[roundid-1].objectives[team];

    var cost = objectives.getAllObjectivesCost(carnival, teamobjectives);

    res.status(200).send({ objectivescount : teamobjectives.length, cost : cost});
});

app.delete('/:roundid/:team/:objectiveid', function (req, res){
    var carnival = req.app.get('carnival');
    var roundid = parseInt(req.params.roundid);
    var objectiveid = parseInt(req.params.objectiveid);
    var team = req.params.team;

    objectives.deleteObjective(carnival, team, roundid, objectiveid)

    res.status(200).send(carnival.game.rounds[roundid-1].objectives[team]) ;
});

module.exports = app;