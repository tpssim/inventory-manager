const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors())

app.get('/api/products/:category', (req, res) => {
  const category = req.params.category

  axios
    .get('https://bad-api-assignment.reaktor.com/v2/products/' + category)
    .then(response => {
      return res.json(response.data);
    })
    .catch(error => {
      console.log('error: ', error);
      return res.status(500).json({ type: 'error', message: 'error' });
    });
});

app.get('/api/availability/:manufacturer', (req, res) => {
  const manufacturer = req.params.manufacturer

  axios
    .get('https://bad-api-assignment.reaktor.com/v2/availability/' + manufacturer)
    .then(response => {

      // Make the ugly data more pretty
      res.json(response.data.response.map((item, i) => {
        let availability = item.DATAPAYLOAD;
        availability = availability.slice(availability.indexOf('<INSTOCKVALUE>')+14, availability.indexOf('</INSTOCKVALUE>'));
        // Id to lowercase to be uniform with the products API
        return {'id':item.id.toLowerCase(), 'availability':availability};
      }));
    })
    .catch(error => {
      console.log('error: ', error);
      return res.status(500).json({ type: 'error', message: 'error' });
    });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));