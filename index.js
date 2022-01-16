const db = require('./queries')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: true
}));
// parsing the incoming data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cookie parser middleware
app.use(cookieParser());

app.get('/',(req,res) => {
  session=req.session;
  if(session.userid){
      res.send("Welcome User <a href=\'/logout'>click to logout</a>");
  }else
  res.sendFile('views/index.html',{root:__dirname})
});


app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express, and Postgres API' })
  })

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)
app.delete('/sign_out/:id', db.signOutUser)
app.post('/sign_in', db.createSession)


app.listen(port, () => {
    console.log(`App running on port ${port}.`)
  })