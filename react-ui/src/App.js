import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css';

function App() {

  const [products, setProducts] = useState([])
  const [availability, setAvailability] = useState(new Map())

  useEffect(() => {
    axios
      .get('/api/products/beanies')
      .then(res => setProducts(res.data))
      .catch(err => console.log(err))
  }, [])

  useEffect(() => {
    // Find all unique manufacturers
    const manufacturers = [...new Set(products.map(item => item.manufacturer))]

    manufacturers.forEach((manufacturer) => {
      axios
        .get('/api/availability/' + manufacturer)
        .then(res => {
          const resMap = new Map(res.data.map(item => [item.id, item.availability]))
          setAvailability(a => new Map(a.set(manufacturer, resMap)))
        })
        .catch(err => console.log(err))
    })
  }, [products])

  useEffect(() => {
    console.log(availability)
  }, [availability])


  return (
    <div className="App">
      <h2>Products</h2>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Manufacturer</th>
            <th>Availability</th>
          </tr>
          {products.map((product, i) => 
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.manufacturer}</td>
              <td>{availability.has(product.manufacturer) && availability.get(product.manufacturer).has(product.id) ? availability.get(product.manufacturer).get(product.id) : 'Loading'}</td>
            </tr>      
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
