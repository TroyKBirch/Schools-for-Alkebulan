//#region packages installed
//! Packages installed
//     > npm i express --save
//     > npm i body-parser --save
//     > npm i mssql --save
//     > npm i ejs --save
//     > npm i mongoose --save
//#endregion

//#region npm packages
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const sql = require('mssql');
const courseRoutes = require('./routes/courseRoutes');
const questionRouter = require('./routes/questionRouter');
const testRouter = require('./routes/testRouter');
const mongoose = require('mongoose');
//#endregion

//#region Db Configuration
//mssql
const sqlConfig = {
    server: "localhost", 
    //port: port,//port number is 3000
    user: "sa",
    password: "May7422453",
    database: "AlkebulanDatabase",
    stream: true,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        //encrypt: true, // for azure
        keepAlive: true,
        trustServerCertificate: true, // change to true for local dev / self-signed certs
        enableArithAbort: true,
    }
};

//#region [rgba(100,100,100,0.2)] mongoose setup
var connectionString = 'mongodb://localhost/AlkebulaanDBTest';

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;


db.on('error', (error) => console.error(error));
db.once('open', () => console.log('connected to mongoose database'));
//#endregion
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
app.use('/question', questionRouter);
//#endregion

//#region get requests
//Endpoint which will render the page after connecting to the database
app.get('/grades', (req, res) => {    
    var request = new sql.Request();

    //SQL query **NOTE: add a WHERE clause to get a specific Profile's grades
    request.query('select * from Mark', (err,data) => {
        if (err) {
            return console.error(err);
        }
        /*  The code below will store the results obtained from the query in a variable called "grades". 
            This variable will act as an Array(object) which will be implemented in the view "grades.ejs"
            where each item is iterated through and the object's property gets called and displayed in a column-row 
            manner.
        */
        //res.send(data.recordset);
        var grades = data.recordset;//data.recordset stores an array of objects
        console.log('Results Sent');
        res.render('grades',{grades:grades}); //On grades.ejs, the str val will be accessed by title (the property name)
    });
});


app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/', (req, res) => {
    res.redirect('/home');
});
//#endregion

//Connection to the database is made before initiating the server
/*
    Solution explained @: https://github.com/tediousjs/node-mssql/issues/1035
*/
sql.connect(sqlConfig, (err, pool) => {
    if (err) {
        return console.error(err);
    } 
    console.log('DB connection established - Starting server......'); 
    const server = app.listen(port, () => {
        console.log(`App listening on port ${port}!`);
    });
    server.on('close', sql.close.bind(sql));
});

