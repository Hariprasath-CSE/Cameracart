require('dotenv').config();
const express = require('express');
const fs = require('fs');
const app = express();
const connectDB = require('./config/db');

connectDB();
app.use(express.json());

const productsRouter = require('./routes/products');
const cartRouter = require('./routes/cart');
const cors = require('cors');

app.use(cors());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.get("/", (req, res) => {
    res.json({ message: 'Hello, Json!' });
});

app.get("/about", (req, res) => {
    res.json({ message: 'About Json!' });
});

app.use('/products', productsRouter);
app.use('/cart', cartRouter);
app.use('/orders', require('./routes/orders'));
app.use('/auth', require('./routes/auth'));

app.listen(3000, () => {
    console.log('Server is running http://localhost:3000');
});
