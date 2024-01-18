import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await axios.get('https://fakestoreapi.com/products/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, []);

  const fetchProductsByCategory = async (category) => {
    try {
      const response = await axios.get(`https://fakestoreapi.com/products/category/${category}`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCategoryChange = (category) => {
  setSelectedCategory(category);
  fetchProductsByCategory(category);
};

return (
  <div className="App">
    <h1>FakeStore E-commerce</h1>
    <div className="category-list">
      <label>Choose a Category:</label>
      <select onChange={(e) => handleCategoryChange(e.target.value)} value={selectedCategory}>
      <option>all</option>
        {categories.map((category) => (
          <option key={category} value={category}>
        {category}
        </option>
        ))}

      </select>
    </div>
    <div className="product-list">
      {products.map((product) => (
        <div key={product.id} className="product">
          <img src={product.image} alt={product.title} />
          <h3>{product.title}</h3>
          <p>${product.price}</p>
          <button>Add to Cart</button>
        </div>
      ))}
    </div>
  </div>
);
}

export default App;


