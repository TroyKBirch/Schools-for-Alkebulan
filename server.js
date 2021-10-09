/*
Packages installed
    > npm i express --save
    > npm i body-parser --save
    > npm i mssql --save
    > npm i ejs --save
*/
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const port = 3000;
const sql = require('mssql');
const courseRoutes = require('./routes/courseRoutes');
const questionRouter = require('./routes/questionRouter');
const testRouter = require('./routes/testRouter');

//Db configuration
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

app.use(bodyParser.urlencoded({extended: false}));
app.set('view engine', 'ejs');

//Middleware & staticfiles
app.use(express.static('public'));
app.use(express.json());

//Course routes
app.use('/courses', courseRoutes);
app.use('/test', testRouter);
app.use('/question', questionRouter);

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

