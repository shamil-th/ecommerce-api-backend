const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const path = require('path');
const cors = require('cors');
const bodyparser = require('body-parser');
const multer = require('multer')
const connectDB = require('./server/database/connect')

const app = express();

dotenv.config()
const PORT = process.env.PORT || 8080

app.use(express.json());
app.use(cors());

app.use(morgan('tiny'));

// mongodb connection
connectDB();

// parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}))

// Define the storage strategy for file uploads
const storage = multer.memoryStorage();

// Initialize multer with the storage strategy
const upload = multer({storage : storage});

app.use("/category", express.static(path.resolve(__dirname,"category")));
app.use("/products", express.static(path.resolve(__dirname,"products")));

// admin
app.use('/admin', require('./server/routes/adminRouter'));
app.use('/category', require('./server/routes/categoryRouter'));
app.use('/products', require('./server/routes/productRouter'));

// customer
app.use('/customer',require('./server/routes/customerRoutes'));

app.listen (PORT, ()=>{
    console.log(`app is running on port http://localhost:${PORT}`);
})