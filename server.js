var http = require('http');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var fs = require('fs');

// logic
const rules = require('./modules/rule');
const routes = require('./modules/route');
const game = require('./modules/game');

var app = express();
app.use(cors());
app.use( bodyParser.json());

app.use(function(req,res,next){
    console.log(req.method + '\t' + req.originalUrl);
    next();
});

var carnival = JSON.parse(fs.readFileSync('carnival.json', 'utf8'));
app.set('carnival', carnival);

game.newSession();
rules.initializeCarnival(carnival);
app.set('routes',routes.initializeCarnivalRoutes(carnival));

app.use('/game', require('./routes/game'));
app.use('/routes', require('./routes/route'));
app.use('/teams', require('./routes/team'));
app.use('/territories', require('./routes/territory'));
app.use('/objectives', require('./routes/objective'));

// game state backup
app.use(function(req,res,next){
    if(req.method !== 'GET'){
        game.save(req.app.get('carnival'));
    }

    next();
});


var port = process.env.PORT || 3000;
http.createServer(app).listen(port);
console.warn('listening on port ' + port);

module.exports = app;