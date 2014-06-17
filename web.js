var express = require('express');
var http = require('http');
var gzippo = require('gzippo');
var app = express();

//app.use(express.logger());
app.engine('html', require('ejs').renderFile);
app.set('views', __dirname);
app.use(gzippo.staticGzip('' + __dirname));

app.get('/', function (req, res) {
  res.render('index.html');
});

var server = http.createServer(app);
server.listen(process.env.PORT || 5000);
