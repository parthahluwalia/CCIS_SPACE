var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));

var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.get('/', function (req, res) {
    res.status(200).send('<h1>HELLO WORLD</h1>');
});

app.get('/foo', function(req, res){
    res.status(200).send('Foo Bar');
});

app.listen(port, ipaddress);