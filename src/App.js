import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginMessage, setLoginMessage] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        // Obtener categorías
        const categoriesResponse = await axios.get('https://fakestoreapi.com/products/categories');
        setCategories(categoriesResponse.data);

        // Obtener todos los productos inicialmente solo si el usuario está autenticado
        if (isLoggedIn) {
          const productsResponse = await axios.get('https://fakestoreapi.com/products');
          setProducts(productsResponse.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, [isLoggedIn]);

  const fetchProductsByCategory = async (category) => {
    try {
      // Si la categoría es '', obtener todos los productos
      const response = category === ''
        ? await axios.get('https://fakestoreapi.com/products')
        : await axios.get(`https://fakestoreapi.com/products/category/${category}`);

      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Si hay un error al obtener productos, establecer products como un array vacío
      setProducts([]);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);

    // Si la categoría seleccionada es '', obtener todos los productos
    fetchProductsByCategory(category);
  };

  const handleLoginInputChange = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://fakestoreapi.com/auth/login', loginData);
      console.log('Login successful:', response.data);
      setIsLoggedIn(true);
      setLoginMessage('Login successful');

      // Limpiar el formulario después de iniciar sesión
      setLoginData({
        username: '',
        password: '',
      });
    } catch (error) {
      console.error('Error logging in:', error);
      setLoginMessage('Invalid username or password');
      // Aquí podrías manejar el error de inicio de sesión, mostrar un mensaje al usuario, etc.
    }
  };

  const handleLogout = () => {
    // Limpiar cualquier información de sesión necesaria
    setIsLoggedIn(false);
    setLoginMessage('');
  };

  return (
    <div className="App">
      <h1>FakeStore E-commerce</h1>

      {isLoggedIn ? (
        <>
          <div className="category-list">
            <label>Choose a Category:</label>
            <select onChange={(e) => handleCategoryChange(e.target.value)} value={selectedCategory}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div className="product-list">
            {Array.isArray(products) && products.map((product) => (
              <div key={product.id} className="product">
                <img src={product.image} alt={product.title} />
                <h3>{product.title}</h3>
                <p>${product.price}</p>
                <button>Add to Cart</button>
              </div>
            ))}
          </div>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleLoginSubmit}>
            <label>Username:</label>
            <input type="text" name="username" value={loginData.username} onChange={handleLoginInputChange} required />

            <label>Password:</label>
            <input type="password" name="password" value={loginData.password} onChange={handleLoginInputChange} required />

            <button type="submit">Login</button>
          </form>
          {loginMessage && <p>{loginMessage}</p>}
          <p>Please log in to view products.</p>
        </div>
      )}
    </div>
  );
}

export default App;

