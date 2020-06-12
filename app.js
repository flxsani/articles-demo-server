import express from 'express';
import bodyParser from 'body-parser';
// import api from './application/api';
import router from './application/routes/web.router';
import path from 'path';
import { DataService } from './db';

let config = require('./config');
let app = express();
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

/// CORS Setup
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, X-Callback-Type, Content-Type, Accept, Authorization");
    res.header('Cache-Control', 'no-cache');
    if ('OPTIONS' == req.method) {
        res.send(200);
    }
    else {
        next();
    }
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/application/web/components'));

app.use(express.static('public')); /// Servers all the request for static assets

app.use('/', router); // Routes management
// app.use('/api', api);

app.listen(config.ConfigData.Port, () => {
    console.log(' ********** : running on ', config.ConfigData.Port);
})
module.exports = app;