const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
var fileupload = require('express-fileupload');

const User = require('./models/user');


dotenv.config();

const app = express()

mongoose.connect(
    process.env.DATABASE,
 { useUnifiedTopology: true, useNewUrlParser: true },
 (err) => {
    if (err) {
        console.log(err);
    }else {
        console.log('connected to the database');
    }
});

//middlewares
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(fileupload({
    useTempFiles: true
}));

// require apis
const productRoutes = require('./routes/product');
const categoryRoutes = require('./routes/category');
const ownerRoutes = require('./routes/owner');

app.use("/api", productRoutes);
app.use("/api", categoryRoutes);
app.use("/api", ownerRoutes);

app.listen(3000, err =>{
    if (err) {
        console.log(err);
    }else {
        console.log("listening on port...", 3000);
    }
});



