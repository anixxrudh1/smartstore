import axios from 'axios';

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTAxYjM0ODA4ZWE5YWU4MzdiOTc2MCIsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJpYXQiOjE3Nzk0NDA0MzYsImV4cCI6MTc4MDA0NTIzNn0.gcY4RaO761Pag20-pmZOwG12NbiFR9UhqB40t8b-1Hc';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Authorization': `Bearer ${TOKEN}`,
    'Content-Type': 'application/json',
  },
});

const products = [
  { name: 'Wireless Earbuds', price: 79.99, stock: 150, category: 'Electronics', description: 'Premium wireless earbuds with noise cancellation and 30-hour battery life' },
  { name: 'Coffee Maker', price: 45.50, stock: 80, category: 'Appliances', description: 'Automatic coffee maker with 12-cup capacity and programmable timer' },
  { name: 'Running Shoes', price: 120, stock: 200, category: 'Footwear', description: 'Professional running shoes with cushioned sole for daily workout' },
  { name: 'Desk Lamp', price: 35.99, stock: 120, category: 'Furniture', description: 'LED desk lamp with adjustable brightness and USB charging port' },
  { name: 'Mechanical Keyboard', price: 99.99, stock: 90, category: 'Electronics', description: 'RGB mechanical keyboard with Cherry MX switches and aluminum frame' },
  { name: 'Yoga Mat', price: 29.99, stock: 300, category: 'Sports', description: 'Non-slip yoga mat 6mm thick with carrying strap' },
  { name: 'USB-C Cable', price: 14.99, stock: 500, category: 'Electronics', description: 'High-speed USB-C charging cable 2m, supports 100W fast charging' },
  { name: 'Water Bottle', price: 24.99, stock: 250, category: 'Sports', description: 'Insulated stainless steel water bottle 1L keeps drinks hot/cold for 24 hours' },
  { name: 'Portable Speaker', price: 89.99, stock: 75, category: 'Electronics', description: 'Waterproof Bluetooth speaker with 360° sound and 12-hour battery' },
  { name: 'Winter Jacket', price: 199.99, stock: 60, category: 'Clothing', description: 'Warm winter jacket with thermal lining and windproof technology' },
  { name: 'Phone Stand', price: 12.99, stock: 400, category: 'Accessories', description: 'Adjustable phone stand compatible with all smartphone sizes' },
  { name: 'Laptop Backpack', price: 69.99, stock: 110, category: 'Accessories', description: 'Durable laptop backpack with 15.6 compartment and USB charging port' },
];

async function addProducts() {
  try {
    for (const product of products) {
      const response = await api.post('/products', product);
      console.log(`✓ Added: ${product.name} - $${product.price}`);
    }
    console.log(`\n✓ Successfully added ${products.length} products!`);
    process.exit(0);
  } catch (error) {
    console.error('Error adding products:', error.response?.data || error.message);
    process.exit(1);
  }
}

addProducts();
