const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyparser = require("body-parser");
const path = require("path");
const cors = require('cors')
dotenv.config()
const methodOverride = require('method-override');
const connectDB = require("./server/database/connection");
connectDB()
const session = require("express-session")
app.use(express.json());

app.use(session({
  secret: 'mega cart',
  resave: false,  
  saveUninitialized: false
}));


app.use(cors({
  origin: ["http://localhost:5173",'https://ctfa.vercel.app'],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

 

// app.use((req, res, next) => {
//   res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//   res.setHeader("Pragma", "no-cache");
//   res.setHeader("Expires", "0");
//   next();
// });


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
app.use("/", require("./server/routes/tudoRouter"));
app.use("/", require("./server/routes/adminRouter"))

app.all('*',(req,res)=>{
  const url= req.url
  res.status(404).render("404",{url})
})



app.listen(PORT, () => {
  console.log("Server is running at port " + PORT);
});

