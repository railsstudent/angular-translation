var express = require('express');
var bodyParser = require('body-parser');

var phraseApi = require('./server/phraseApi');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('.'));
app.use(require('connect-livereload')());

app.get('/api/phrases', function(req, res) {
    console.log('/api/phrases called');
    res.send(phraseApi.getPhrases());
});

app.get('/mock', function (request, response) {
    response.sendFile(__dirname + '/indexMock.html');
});

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/index.html');
});

app.listen(8000, function(req, res) {
  console.log('Express server started!!!');
});
