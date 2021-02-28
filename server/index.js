const express = require('express');
const cors = require('cors');
const axios = require('axios');
const redis = require('redis');

const baseURL = 'https://bad-api-assignment.reaktor.com/v2/'

const client = redis.createClient(process.env.REDIS_URL);
const app = express();

app.use(cors());

app.use(express.static('build'))

app.get('/api/products/:category', (req, res) => {
  const category = req.params.category;

  try {
    // Check the cache for requested data
    client.get(category, async (err, response) => {
      if (err) {
        throw err;
      }
      // Data was cached
      if (response) {
        return res.json(JSON.parse(response));
      }
      // Data was not cached 
      else {
        const products = await axios.get(baseURL + 'products/' + category);
        client.setex(category, 5*60, JSON.stringify(products.data));
        return res.json(products.data);
      }
    });
      
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'error' });
    }

});

app.get('/api/availability/:manufacturer', (req, res) => {
  const manufacturer = req.params.manufacturer;

  try {
    // Check the cache for requested data
    client.get(manufacturer, async (err, response) => {
      if (err) {
        throw err;
      }
      // Data was cached
      if (response) {
        return res.json(JSON.parse(response));
      }
      // Data was not cached 
      else {

        axios
          .get(baseURL + 'availability/' + manufacturer)
          .then(response => {

            let availability = response.data.response.map((item, i) => {
              let availability = item.DATAPAYLOAD;
              availability = availability.slice(availability.indexOf('<INSTOCKVALUE>')+14, availability.indexOf('</INSTOCKVALUE>'));
              // Id to lowercase to be uniform with the products API
              return {'id':item.id.toLowerCase(), 'availability':availability};
            });
    
            client.setex(manufacturer, 5*60, JSON.stringify(availability));
            return res.json(availability);
          })
          .catch(error => {
            console.log(error);
            return res.status(500).send({ message: 'error' });
          })
      }
    });
      
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: 'error' });
    }

});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`listening on ${PORT}`));