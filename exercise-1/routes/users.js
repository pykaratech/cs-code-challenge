var express = require('express');
var router = express.Router();
const fs = require('fs');

router.get('/', function(req, res, next) {
  res.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('index.test.html').pipe(res)
  // res.render('index', { title: 'Express' });
});

module.exports = router;
