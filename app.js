const express = require("express");
const app = express();
const path = require("path");
require('dotenv').config();
const session = require("express-session");
const connectDB = require('./config/mongo');
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes")



app.use('/static',express.static(path.join(__dirname,"public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());



connectDB()

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

app.use(
  session({
    secret: 'your_secret_key', // Replace with a secure key
    resave: false,
    saveUninitialized: true
  })
);

//use router
app.use(userRoutes);
app.use(adminRoutes);


app.listen(3000, ()=>{
    console.log(`server is running on the http://localhost:3000/`)
})
