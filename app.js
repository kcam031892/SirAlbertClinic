const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const connectDb = require('./config/db');

dotenv.config();

// Router Files
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');

const app = express();

// MongoDB Session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'session',
});

// Template Engine
app.set('view engine', 'pug');

// Static Files
app.use(express.static(path.join(__dirname, 'public')));
// Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
// Express Session
app.use(
  session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(authRoutes);
app.use(adminRoutes);

app.use('/', (req, res, next) => {
  res.send('hello');
});

const PORT = process.env.PORT || 3030;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Listening on http://localhost:${PORT}`);
  });
});
