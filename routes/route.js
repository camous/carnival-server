const express = require('express');
var _ = require('lodash');
const app = express.Router();

app.get('/:from/:to', function (req,res){
    var carnival = req.app.get('carnival');

    var from = req.params.from;
    var to = req.params.to;
    var route = req.app.get('routes').path(from,to);

    var crossedTerritories = {};
    for(var id in route){
        var territory = route[id];
        crossedTerritories[territory] = carnival.territories[territory].meta;
    }

    res.status(200).send({ route : route, territories : crossedTerritories});
});

module.exports = app;