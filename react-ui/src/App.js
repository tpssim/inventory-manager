import React, { useState, useEffect } from 'react';
import { productRequest, availabilityRequest } from './utils';
import ProductRow from './components/ProductRow';
import Spinner from 'react-bootstrap/Spinner';
import './App.css';

function App() {

  const categories = ['beanies', 'facemasks', 'gloves'];

  const [category, setCategory] = useState(categories[0]);
  const [products, setProducts] = useState([]);
  const [availability, setAvailability] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [availabilitiesLoading, setAvailabilitiesLoading] = useState(new Set([]));

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

  const getProducts = async (category) => {
    setLoading(true);
    const res = await productRequest(category);
    if (res) {
      setProducts(res)
    }
    setLoading(false);
  }

  const getAvailability = async (manufacturer) => {
    setAvailabilitiesLoading(a => new Set(a.add(manufacturer)));
    
    const res = await availabilityRequest(manufacturer);
    if (res) {
      setAvailability(a => new Map(a.set(manufacturer, res))); 
    }

    setAvailabilitiesLoading(a => {
    a.delete(manufacturer);
      return new Set(a);
    });
  }

  const resolveAvailability = (manufacturer, id) => {
    let result = [];

    if (availability.has(manufacturer) && availability.get(manufacturer).has(id)) {
      result.status = availability.get(manufacturer).get(id);
    } else {
      result.status = '  ?  ';
    }
    if (availabilitiesLoading.has(manufacturer)) {
      result.loading = true;
    } else {
      result.loading = false;
    }
    return result;
  }

  return (
    <div className="App">
      {categories.map((cat, i) =>         
        <button onClick={() => setCategory(cat)} key={i}>
          {cat}
        </button>
      )}
      <h2>{category}</h2>
      <div>
        {
          loading ?
            <>
              <Spinner animation="border"/>
            </> 
          :
          <table className="ProductTable">
            <tbody>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Manufacturer</th>
                <th>Color</th>
                <th>Price</th>
                <th>Availability</th>
              </tr>
              {
                products.map((product, i) =>
                  <ProductRow 
                    key={i} 
                    product={product} 
                    availability={resolveAvailability(product.manufacturer, product.id)} 
                  />             
              )}
            </tbody>
          </table>
        }
      </div>
    </div>
  );
}

export default App;
