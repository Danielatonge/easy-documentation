const express = require('express');
const next = require('next');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoSessionStore = require('connect-mongo');

require('dotenv').config();

const setupGoogle = require('./google');
const { insertTemplates } = require('./models/EmailTemplate');
const registerApiRoutes = require('./api');

const { ROOT_URL, MONGO_URL, NODE_ENV, PORT, SESSION_NAME, SESSION_SECRET } = process.env;
const port = parseInt(PORT, 10) || 8000;
const dev = NODE_ENV !== 'production';

const URL_MAP = {
  '/login': '/public/login',
  '/my-books': '/customer/my-books',
};

const options = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
};

mongoose.connect(MONGO_URL, options);

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(async () => {
  const server = express();
  const MongoStore = mongoSessionStore(session);
  const sess = {
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      maxAge: 14 * 24 * 60 * 60 * 1000,
      domain: 'localhost',
    },
  };

  server.use(session(sess));
  await insertTemplates();
  setupGoogle({ ROOT_URL, server });

  registerApiRoutes(server);

  server.get('/books/:bookSlug/:chapterSlug', (req, res) => {
    const { bookSlug, chapterSlug } = req.params;
    app.render(req, res, '/public/read-chapter', { bookSlug, chapterSlug });
  });

  server.get('*', (req, res) => {
    const url = URL_MAP[req.path];
    if (url) {
      app.render(req, res, url);
    } else {
      handle(req, res);
    }
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on port http://localhost:${port}`);
  });
});
