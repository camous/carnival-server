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

// var pouet = _.map(carnival.game.continents, (v1,v2) => {

// });

// var paths = _.groupBy(_.flatMap(_.flatMap(carnival.game.continents,'territories'),'nodes'), (key,value) => {
//     console.log(key);
//     return true;
// });

var territories = _.flatMap(carnival.game.continents,'territories');
for(var id in territories){
    var territory = territories[id];
    for(var id2 in territory.nodes){
        var pathvalue = territory.nodes[id2];
        var refnode = {}, refnodeback = {};
        refnode[id2] = pathvalue;
        refnodeback[territory.id] = pathvalue;
        route.addNode(territory.id, refnode );
        route.addNode( id2, refnodeback );
    }
}

var port = process.env.PORT || 3000;
http.createServer(app).listen(port);
console.warn('listening on port ' + port);