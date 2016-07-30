var express = require('express');
var bodyParser = require('body-parser');

//var bookShelfApi = require('./server/bookShelfApi');
var phraseApi = require('./server/phraseApi');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.json({type: 'application/vnd.api+json'}));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('.'));
app.use(require('connect-livereload')());

/*app.get('/api/activeBooks', function (request, response) {
    response.send(bookShelfApi.getBooks(false));
});

app.get('/api/archivedBooks', function (request, response) {
    response.send(bookShelfApi.getBooks(true));
});

app.post('/api/books', function (request, response) {
    var newBook=request.body;
    if(!newBook.title){
        response.send(500,{errorText:'No data found to add'});
    }
    else {
        bookShelfApi.addABook(newBook);
        response.send(200, {message: 'New book added to the list'});
    }
});

app.put('/api/markRead/:id', function (request, response) {
    if(!request.params.id){
        response.send(500,{errorText:'BookId not sent'});
    }
    else if(request.body.read === undefined || request.body.read === null){
        response.send(500,{errorText:'No data found to edit'});
    }
    else{
        var modifiedBook = bookShelfApi.modifyReadStatus(parseInt(request.params.id), request.body.read);
        if(modifiedBook === null){
            response.send(500,{errorText:'Book not found in the list'});
        }
        else{
            response.send(modifiedBook);
        }
    }
});

app.put('/api/addToArchive/:id', function (request, response) {
    if(!request.params.id){
        response.send(500,{errorText:'Can\'t update book if id is not sent'});
    }
    else{
        var modifiedBook = bookShelfApi.addToArchive(parseInt(request.params.id));
        if(modifiedBook === null){
            response.send(500,{errorText:'Book not found in the list'});
        }
        else{
            response.send(modifiedBook);
        }
    }
});

app.get('/api/bookExists/:title', function (request, response) {
    if(!request.params.title){
        response.send(500, {errorText:'Can\'t check existence of book if title is not sent'});
    }
    else{
        response.send(bookShelfApi.bookExists(request.params.title));
    }
});
*/

app.get('/api/phrases', function(req, res) {
    console.log('/api/phrases called');
    res.send(phraseApi.getPhrases());
});

app.get('/mock', function (request, response) {
    response.sendfile('indexMock.html');
});


app.get('/', function (request, response) {
    response.sendfile('index.html');
});

app.listen(8000, function(req, res) {
  console.log('Express server started!!!');
});
