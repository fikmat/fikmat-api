require('dotenv').config();

const express = require('express');
const debug = require('debug')('fikmat-api:server');

const app = express();
const http = require('http');
const server = http.createServer(app);
const port = process.env.PORT || '8020';

const api = require('./lib/api.js');

app.use(express.json());

const rateLimit = require("express-rate-limit")
const limiter = rateLimit({
  windowMs: 1000 / 10,
  max: 1
});
app.use(limiter);

app.get('/', (req, res) => {
  res.send('Fikmat API is running.');
})

app.post('/api', (req, res) => {
  debug('api request', req.body);

  api.update(req.body);

  res.sendStatus(200);
});

const jsonErrorHandler = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  if (status >= 500) {
    console.error(err);
  }
  const message = status < 500 ? err.message : 'Internal Server Error';
  res.status(status).send({ error: message });
}
app.use(jsonErrorHandler);

api.on('ready', () => {
  server.listen(port, () => {
    debug(`Fikmat API test app runs at http://localhost:${port}`);
  });
});

module.exports = server
