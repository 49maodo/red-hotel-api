const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const port = 8000
const connectDB = require('./config/db')

// Connect to MongoDB
connectDB();

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, 
}))

app.use(cookieParser())

app.use('/home' , (req, res) => {
    res.json('Hello World!')
})

// auth user
app.use('/api', require('./routes/auth.routes'))
app.listen(port, () =>
    console.log(`Server running on port ${port}`)
);