const express = require("express");
const app = express();
const dotenv = require("dotenv");
const MongoStore=require("connect-mongo")
const bodyparser = require("body-parser");
const path = require("path");
dotenv.config()
const methodOverride = require('method-override');
const connectDB = require("./server/database/connection");
connectDB()
const session = require("express-session")

app.use(session({
  secret: 'mega cart',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: 'mongodb+srv://admin:1234@cluster2.nn7wbmp.mongodb.net/' }),
}));



app.use(methodOverride('_method'));


const PORT = process.env.PORT || 5000;

app.use(bodyparser.urlencoded({ extended: true }));

//setting view engine 
app.set("view engine", "ejs");


//serve static assets    
app.use("/css", express.static(path.join(__dirname, "assets/css")));
app.use("/css", express.static(path.join(__dirname, "admin/include2")));
app.use("/js", express.static(path.join(__dirname, "assets/js")));
app.use("/img", express.static(path.join(__dirname, "assets/img")));
app.use("/primg", express.static(path.join(__dirname, "images")));

app.use("/", require("./server/routes/userRouter"));
app.use("/", require("./server/routes/adminRouter"))




app.listen(PORT, () => {
  console.log("Server is running at port " + PORT);
});

