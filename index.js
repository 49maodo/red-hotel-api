const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const port = 8000
const connectDB = require('./config/db')
const path = require('path');
const { swaggerUi, specs } = require('./swagger')
// Connect to MongoDB
connectDB();

const app = express();
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: [
        'https://red-hotel.onrender.com',
        'https://red-hotel.vercel.app',
        'http://localhost:3000',
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));

// Configuration pour servir les fichiers statiques
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use('/uploads/hotels', express.static(path.join(__dirname, 'uploads/hotels')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/home', (req, res) => {
    res.json('Hello World!, ')
})

// auth user
app.use('/api', require('./routes/auth.routes'))
app.use('/hotel', require('./routes/hotel.routes'))
app.listen(port, () =>
    console.log(`Server running on port ${port}`)
);