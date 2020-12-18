const express = require('express');
const path = require('path');
const app = express();
var sslRedirect = require('heroku-ssl-redirect');


app.use(sslRedirect(['dev', 'production']));
// Serve static files....
app.use(express.static(__dirname + '/dist/covid-local'));

// Send all requests to index.html
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/covid-local/index.html'));
});

// default Heroku PORT
app.listen(process.env.PORT || 3000);
