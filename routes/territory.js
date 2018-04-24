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

app.get('/get/:territory', function (req, res){
    var territory = req.params.territory;
    var carnival = req.app.get('carnival');

    res.status(200).send(carnival.territories[territory].meta);
});

app.get('/continents', function (req, res){
    var carnival = req.app.get('carnival');
    var continents = _.groupBy(carnival.territories, 'meta.continent');

    var results = {};
    for(var id in continents){
        var team1 = 0;
        var team2 = 0;
        var team3 = 0;
        var continent = continents[id];
        
        for(var idterritory in continents[id]){
            var territory = continents[id][idterritory];
            if(territory.meta.count !== undefined) {
                if(territory.meta.count.team1 !== undefined)
                team1 += territory.meta.count.team1;

                if(territory.meta.count.team2 !== undefined)
                    team2 += territory.meta.count.team2;

                if(territory.meta.count.team3 !== undefined)
                    team3 += territory.meta.count.team3;
            }
        }

        results[id] = {
            team1 : team1,
            team2 : team2,
            team3 : team3
        };
    }

    res.status(200).send(results);
});

module.exports = app;