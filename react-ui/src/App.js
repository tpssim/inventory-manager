import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css';

function App() {

  const [products, setProducts] = useState([])

  useEffect(() => {
    axios
      .get('/products/beanies')
      .then(res => setProducts(res.data))
  }, [])

  return (
    <div className="App">
      <h2>Products</h2>
      <table>
        <tbody>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Manufacturer</th>
          </tr>
          {products.map((product, i) => 
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.manufacturer}</td>
            </tr>      
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
