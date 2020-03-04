const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const dotenv = require('dotenv')

//routes
const productRoutes = require('./routes/product-routes');
const userRoutes = require('./routes/user-routes');
const authRoutes = require('./routes/auth-routes');
const cartRoutes = require('./routes/cart-routes');
const orderRoutes = require('./routes/order-routes');

//configurations
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

dotenv.config({
    path: './.env'
})

//middleware sorts out CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Methods',
        'OPTIONS, GET, POST, PUT, PATCH, DELETE'
    );
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

//use routes
app.use("", productRoutes);
app.use("", userRoutes);
app.use("", authRoutes)
app.use("", cartRoutes)
app.use("", orderRoutes)

app.use((error, req, res, next) => {
    // console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message: message,
        data: data
    });
});
//db and start server
mongoose.connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then((result) => {
        console.log('The Database Is Up');
    })
    .catch(err => {
        console.log(err);
    });

app.listen(8080, res => {
    console.log("...server running");
});