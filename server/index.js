const express = require('express');
const request = require('request');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/products/:category', (req, res) => {
  const category = req.params.category
  request(
    { url: 'https://bad-api-assignment.reaktor.com/v2/products/' + category },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }

      res.json(JSON.parse(body));
    }
  )
});

app.get('/availability/:manufacturer', (req, res) => {
  const manufacturer = req.params.manufacturer
  request(
    { url: 'https://bad-api-assignment.reaktor.com/v2/availability/' + manufacturer },
    (error, response, body) => {
      if (error || response.statusCode !== 200) {
        return res.status(500).json({ type: 'error', message: err.message });
      }

      res.json(JSON.parse(body));
    }
  )
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));