var http = require('http');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs');

// logic
const rules = require('./modules/rule');
const routes = require('./modules/route');

//https://github.com/weaver/moniker

var app = express();
app.use(cors());
app.use( bodyParser.json());

var carnival = JSON.parse(fs.readFileSync('carnival.json', 'utf8'));
app.set('carnival', carnival);

rules.initializeCarnival(carnival);
app.set('routes',routes.initializeCarnivalRoutes(carnival));

app.use('/routes', require('./routes/route'));
app.use('/teams', require('./routes/team'));

var port = process.env.PORT || 3000;
http.createServer(app).listen(port);
console.warn('listening on port ' + port);

module.exports = app;