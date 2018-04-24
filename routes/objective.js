const express = require('express');
const app = express.Router();
var _ = require('lodash');
const objectives = require('../modules/objective');
const game = require('../modules/game');

app.get('/:roundid/:team', function(req,res){
    var carnival = req.app.get('carnival');
    var roundid = req.params.roundid;
    var team = req.params.team;

    res.status(200).send(carnival.game.rounds[roundid-1].objectives[team]);
});

app.put('/:roundid/:team/:objectiveid?', function (req, res, next){
    var carnival = req.app.get('carnival');
    var objectiveid = parseInt(req.params.objectiveid || -1);
    var roundid = parseInt(req.params.roundid);
    var team = req.params.team;

    if(roundid !== game.getRoundNumber(carnival)){
        res.status(403).send('incorrect round');
    } else {
        var teamobjectives = carnival.game.rounds[roundid-1].objectives[team];
        // it's a new objective
        if(objectiveid === -1){
            teamobjectives.push(req.body);
            objectiveid = teamobjectives.length-1;
        }else{
            teamobjectives[objectiveid] = req.body;
        }

        res.status(200).send({objectiveid : objectiveid, objective : teamobjectives[objectiveid]});
        next();
    }
});

app.get('/:roundid/:team/cost', function (req,res){
    var carnival = req.app.get('carnival');
    var roundid = req.params.roundid;
    var team = req.params.team;
    var teamobjectives = carnival.game.rounds[roundid-1].objectives[team];

    var cost = objectives.getAllObjectivesCost(carnival, teamobjectives);

    res.status(200).send({ objectivescount : teamobjectives.length, cost : cost});
});

app.delete('/:roundid/:team/:objectiveid', function (req, res, next){
    var carnival = req.app.get('carnival');
    var roundid = parseInt(req.params.roundid);
    var objectiveid = parseInt(req.params.objectiveid);
    var team = req.params.team;

    if(roundid !== game.getRoundNumber(carnival)){
        res.status(403).send('incorrect round');
    } else {
        objectives.deleteObjective(carnival, team, roundid, objectiveid)

        res.status(200).send(carnival.game.rounds[roundid-1].objectives[team]) ;
        next();
    }
});

app.put('/move', function (req, res, next){
    var carnival = req.app.get('carnival');
    var team = carnival.game.state.team;
    var turnid = carnival.game.state.turns[team];
    var objectiveid = carnival.game.state.objectives[team];

    // where are we ?

    var objective = carnival.game.moves[team][objectiveid];
    if(objective === undefined){
        res.status(403).send('no objective for ' + team);
    }
    else {
        carnival.game.state.objectives[team]  = (carnival.game.state.objectives[team] +1 )%carnival.game.moves[team].length;
        

        var move = { from : objective[turnid+1],
            to : objective[turnid+2]};

        var fight = objectives.move(carnival, team, objective[0], move.from, move.to);

        carnival.game.state.turns[team] += 1;

        res.status(200).send({team : team, turn: turnid,objective : carnival.game.moves[team][objectiveid], move : move, fight : fight});
    }
    if(team==="team1")
        carnival.game.state.team = "team2";
    else if (team === "team2")
        carnival.game.state.team = "team3";
    else
        carnival.game.state.team = "team1";

    next();
});

module.exports = app;