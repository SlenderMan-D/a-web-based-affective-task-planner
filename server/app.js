const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser')
const expressSession = require('express-session')
const MongoStore = require('connect-mongo')(expressSession);

const config = require('./config');
const user = require('./routes/user');
const task = require('./routes/task');
// const userFilter = require('./filter/user');

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(expressSession({
  secret: config.sessionSecret,
  name: 'username',
  saveUninitialized: false,
  resave: true,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 2,
  },
  // store: new MongoStore({
  //   url: config.sessionMongoUrl
  // })
}));

// app.use(cookieParser('345fsdfsdf'))

app.use(function logRequest(req, res, next) {
  console.log(`
  ------BEGIN------
  req.url: ${req.url},
  req.body: ${JSON.stringify(req.body)}
  ------END------
  `)
  next();
})

app.all('*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Credentials', true)
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'PUT, POST, GET, DELETE, OPTIONS'
  );

  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});

app.use('/api/user', user);
app.use('/api/task', task);

mongoose.connect(config.mongoUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  console.log('mongoDB connected successfully')
});


app.listen(3232, () => console.log('Example app listening on port 3232!'))