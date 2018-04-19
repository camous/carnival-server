var http = require('http');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs');
var Graph = require('node-dijkstra');
var _ = require('lodash');

//https://github.com/weaver/moniker


var app = express();
app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.get('/hello', function (req,res){
    res.status(200).send('hello');
});

// dijkstra
var carnival = JSON.parse(fs.readFileSync('carnival.json', 'utf8'));
var risknodes = new Graph();

const route = new Graph();
var paths = {};

for(var territory in carnival.paths){
    if(paths[territory] === undefined){
        paths[territory] = carnival.paths[territory];
    } else {
        paths[territory] = _.merge(paths[territory], carnival.paths[territory]);
    }
    //route.addNode(territory, carnival.paths[territory]);

    var references = _.pickBy(carnival.paths, territory);
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