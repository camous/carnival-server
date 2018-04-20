

const express = require('express');
const app = express.Router();

app.get('/:from/:to', function (req,res){
    var from = req.params.from;
    var to = req.params.to;
    var route = req.app.get('routes').path(from,to);
    res.status(200).send(route);
});

module.exports = app;