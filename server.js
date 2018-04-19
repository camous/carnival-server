var http = require('http');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs');
var Graph = require('node-dijkstra');
var _ = require('lodash');

//https://github.com/weaver/moniker

var carnival = JSON.parse(fs.readFileSync('carnival.json', 'utf8'));


var app = express();
app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.set('carnival', carnival);

app.post('/team/generate/:team', function (req,res){
    var team = req.params.team;
    var carnival = req.app.get('carnival');
    var territories = Object.keys(carnival.territories);

    var resources = carnival.game.rules.resources_per_team;
    var min = carnival.game.rules.min_per_territory;
    var max = carnival.game.rules.max_per_territory;
    
    do {
        var rndres = Math.floor(Math.random() * max-min+1) + min;

        do {
            var territory = territories[Math.floor(Math.random() * territories.length)];
        }while(carnival.territories[territory].meta !== undefined && carnival.territories[territory].meta.team !== undefined);

        _.merge(carnival.territories[territory], { 'meta' :  {'team' : team,'count' : rndres }});
        carnival.territories[territory].meta  = { team : rndres};
        console.log(team + '\t' + territory + '\t' + rndres);

        resources-=rndres;
    }while(resources>=min);

    res.status(200).send(carnival.territories);
});


app.get('/hello', function (req,res){
    res.status(200).send('hello');
});




// dijkstra


const route = new Graph();
var paths = {};
var territories = _.cloneDeep(carnival.territories);
for(var territory in territories){

    var neighbors = territories[territory];
    delete neighbors.meta;

    if(paths[territory] === undefined){
        paths[territory] = neighbors;
    } else {
        paths[territory] = _.merge(paths[territory], neighbors);
    }

    var references = _.pickBy(territories, territory);
    for(var id in references){
        var reference = references[id];
        if(paths[id] === undefined){
            paths[id] = {};
        }
        paths[id][territory] = reference[territory];
    }
}

for(var territory in paths){
    route.addNode(territory, paths[territory]);
}

console.log(route.path('alaska','easternunitedstate'));

var port = process.env.PORT || 3000;
http.createServer(app).listen(port);
console.warn('listening on port ' + port);