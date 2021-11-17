//#region packages installed
//! Packages installed
//     > npm i express --save
//     > npm i body-parser --save
//     > npm i ejs --save
//     > npm i mongoose --save
//#endregion

//#region npm packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const courseRoutes = require('./routes/courseRoutes');
const questionRouter = require('./routes/questionRouter');
const testRouter = require('./routes/testRouter');
const englishRouter = require('./routes/englishRouter');
const mathRouter = require('./routes/mathRouter')
const mongoose = require('mongoose');
//#endregion

//#region [rgba(100,100,100,0.2)] mongoose setup
var connectionString = 'mongodb://localhost/AlkebulaanDBTest';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;


db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to mongoose database'));
//#endregion

//#region app.use and middleware
app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');

//Middleware & staticfiles
app.use(express.static('public'));
app.use(express.json());
//#endregion

//#region routes
app.use('/courses', courseRoutes);
app.use('/test', testRouter);
app.use('/math', mathRouter)
app.use('/english', englishRouter)
app.use('/question', questionRouter);
//#endregion

//#region get requests
//Endpoint which will render the page after connecting to the database
app.get('/grades', (req, res) => {    
    res.render('ToDo');
});

app.get('/about', (req, res) => {    
    res.render('ToDo');
});

app.get('/signup', (req, res) => {    
    res.render('ToDo');
});

app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/', (req, res) => {
    res.redirect('/home');
});
//#endregion

//Starts server on the specified PORT
app.listen(port, () => console.log('Server Started'))