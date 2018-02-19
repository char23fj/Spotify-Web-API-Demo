var express = require('express');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8888);

app.use(express.static('static'));

app.get('/',function(req,res){
  res.render('intro.handlebars');
});
app.get('/getlists',function(req,res){
  res.render('getlists.handlebars');
});
app.get('/gettracks',function(req,res){
  res.render('gettracks.handlebars');
});
app.get('/createadd',function(req,res){
  res.render('createadd.handlebars');
});
app.get('/auth',function(req,res){
  res.render('auth.html');
});
app.get('/example',function(req,res){
  res.render('example.handlebars');
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
