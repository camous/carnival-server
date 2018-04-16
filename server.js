var http = require('http');
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser')

var app = express();
app.use(cors());
app.use( bodyParser.json() );       // to support JSON-encoded bodies

app.get('/hello', function (req,res){
    res.status(200).send('hello');
});

var port = process.env.PORT || 3000;
http.createServer(app).listen(port);
console.warn('listening on port ' + port);