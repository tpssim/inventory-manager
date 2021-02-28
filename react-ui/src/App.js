import React, { useState, useEffect } from 'react';
import { productRequest, availabilityRequest } from './utils'
import './App.css';

function App() {

  const categories = ['beanies', 'facemasks', 'gloves'];

  const [category, setCategory] = useState(categories[0]);
  const [products, setProducts] = useState([]);
  const [availability, setAvailability] = useState(new Map());

  useEffect(() => {
    getProducts(category);
  }, [category]);

  useEffect(() => {
    // Find all unique manufacturers
    const manufacturers = [...new Set(products.map(item => item.manufacturer))]

    manufacturers.forEach((manufacturer) => {
      getAvailability(manufacturer);
    })
  }, [products]);

  useEffect(() => {
    //console.log(availability);
  }, [availability]);

  const getProducts = async (category) => {
    const res = await productRequest(category);
    if (res) {
      setProducts(res)
    }
  }

  const getAvailability = async (manufacturer) => {
    const res = await availabilityRequest(manufacturer);
    if (res) {
      setAvailability(a => new Map(a.set(manufacturer, res))); 
    }
  }

  return (
    <div className="App">
      {categories.map((cat, i) =>
        <button onClick={() => setCategory(cat)} key={i}>
          {cat}
        </button>
      )}
      <h2>{category}</h2>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Manufacturer</th>
            <th>Availability</th>
          </tr>
          {products.map((product, i) =>
            <tr key={i}>
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
