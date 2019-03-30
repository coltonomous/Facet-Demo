// Require npm module dependencies
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000  // # requests per windowMs
});

// Require MVC components
const user = require('./src/routes/user.route');

// Create mysql connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'facet'
})

// Connect to database
connection.connect((err) => {
  if(err){
    throw err;
  }
  console.log('Connected to database');
});
global.connection = connection;

const port = 80;
app.set('port', process.env.port || port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(limiter);

app.use('/users', user);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});