/**
 * Created by Raj on 9/6/2015.
 */
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate 
    moment = require('moment')

router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
    }
}));

//build the REST operations at the base for blobs
//this will be accessible from http://127.0.0.1:3000/blobs if the default route for / is left unchanged
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/reports', function(req, res, next) {
  res.render('reports', { title: 'Express' });
});
router.route('/blobs')
    //GET all blobs
    .get(function(req, res, next) {

var match = {};
var d = new Date();
console.log(moment().format('M'));
var w = moment().format('W');

var h = new Date().getMonth() +1;
var QQQ = "";
var flagW = true;
    switch(req.query.p){
        case 't':
            var start = moment().startOf('day'); // set to 12:00 am today
            var end = moment().endOf('day'); // set to 23:59 pm today
            QQ = {date: {$gte: start, $lt: end}}
            flagW = false;
        break;
        case 'm':
             QQ = [{$project: {"name":1, "date": 1, "price": 1, "item": 1,  "month" :{ $month : "$date"}}},{$match : { "month": parseInt(moment().format('M'))}}];
            QQQ = [ 
                    {$group: { "_id" :{'month': { $month: "$date"},'date': "$date",   "price": "$price"}}},
                    {$group:{ "_id": "$_id.month", "min":{$min:"$_id.price"}, "max":{$max:"$_id.price"}, "count":{$sum:1},"avg":{$avg:"$_id.price"},"total": {$sum: "$_id.price"} }}
                  ];
        break;
        case 'w':
             h = parseInt(moment().format('W'));
            QQ = [{$project: {"name":1, "date": 1, "price": 1, "item": 1,  "week" :{ $week : "$date"}}},{$match : { "week": parseInt(moment().format('W'))}}];
              QQQ = [ 
                    {$group: { "_id" :{'week': { $week: "$date"},'date': "$date",   "price": "$price"}}},
                    {$group:{ "_id": "$_id.week", "min":{$min:"$_id.price"}, "max":{$max:"$_id.price"}, "count":{$sum:1},"avg":{$avg:"$_id.price"},"total": {$sum: "$_id.price"} }}
                  ];
        break;
        case 'y':
            h = parseInt(moment().format('Y'));
            QQ = [{$project: {"name":1, "date": 1, "price": 1, "item": 1,  "year" :{ $year : "$date"}}},{$match : { "year": parseInt(moment().format('Y'))}}];
        break;
        default:
        QQ = [{$project: {"name":1, "date": 1, "price": 1, "item": 1, "month" :{ $month : "$date"}}},{$match : { "month": parseInt(moment().format('M'))}}];
        break;
    }

var callback = function(e, d){
    console.log(d);
     res.format({
                    //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
                    html: function(){
                        res.render('index.html', {
                            title: 'All my Blobs',
                            "blobs" : d
                        });
                    },
                    //JSON response will show all blobs in JSON format
                    json: function(){
                        res.json(d);
                    }
                });
}

    if(flagW)
        mongoose.model('Blob').aggregate(QQ, callback);
    else
        mongoose.model('Blob').find(QQ, callback);
    })
    //POST a new blob
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
        var name = req.body.name;
        var type = req.body.type;
        var item = req.body.item;
        var price = req.body.price;
        var date = req.body.date;
        //call the create function for our database
        mongoose.model('Blob').create({
            name : name,
            type : type,
            item : item,
            price : price,
            date :date
        }, function (err, blob) {
            if (err) {
                res.send("There was a problem adding the information to the database.");
            } else {
                //Blob has been created
                console.log('POST creating new blob: ' + blob);
                res.format({
                    //HTML response will set the location and redirect back to the home page. You could also create a 'success' page if that's your thing
                    html: function(){
                        // If it worked, set the header so the address bar doesn't still say /adduser
                        res.location("index.html");
                        // And forward to success page
                        res.redirect("/index.html");
                    },
                    //JSON response will show the newly created blob
                    json: function(){
                        res.json(blob);
                    }
                });
            }
        })
    });
// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Blob').findById(id, function (err, blob) {
        //if it isn't found, we are going to repond with 404
        if (err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                },
                json: function(){
                    res.json({message : err.status  + ' ' + err});
                }
            });
            //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            //console.log(blob);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next();
        }
    });
});
router.route('/:id')
    .get(function(req, res) {
        mongoose.model('Blob').findById(req.id, function (err, blob) {
            if (err) {
                console.log('GET Error: There was a problem retrieving: ' + err);
            } else {
                console.log('GET Retrieving ID: ' + blob._id);
               // var blobdob = blob.dob.toISOString();
                //blobdob = blobdob.substring(0, blobdob.indexOf('T'))
                res.format({
                    html: function(){
                        res.render('index.html', {
                            "blob" : blob
                        });
                    },
                    json: function(){
                        res.json(blob);
                    }
                });
            }
        });
    });

//PUT to update a blob by ID
router.put('/:id', function(req, res) {
    // Get our REST or form values. These rely on the "name" attributes
    var name = req.body.name;
    var type = req.body.type;
    var item = req.body.item;
    var price = req.body.price;
    var date = req.body.date;

    //find the document by ID
    mongoose.model('Blob').findById(req.id, function (err, blob) {
        //update it
        blob.update({
            name : name,
            type : type,
            item : item,
            price : price,
            date :date
        }, function (err, blobID) {
            if (err) {
                res.send("There was a problem updating the information to the database: " + err);
            }
            else {
                //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
                res.format({
                    html: function(){
                        res.redirect("/index.html");
                    },
                    //JSON responds showing the updated values
                    json: function(){
                        res.json(blob);
                    }
                });
            }
        })
    });
});
//DELETE a Blob by ID
router.delete('/:id', function (req, res){

    //find blob by ID
    mongoose.model('Blob').findById(req.id, function (err, blob) {
        if (err) {
            return console.error(err);
        } else {
            //remove it from Mongo
            blob.remove(function (err, blob) {
                if (err) {
                    return console.error(err);
                } else {
                    //Returning success messages saying it was deleted
                    console.log('DELETE removing ID: ' + blob._id);
                    res.format({
                        //HTML returns us back to the main page, or you can create a success page
                        html: function(){
                            res.redirect("/index.html");
                        },
                        //JSON returns the item with the message that is has been deleted
                        json: function(){
                            res.json({message : 'deleted',
                                item : blob
                            });
                        }
                    });
                }
            });
        }
    });
});

module.exports = router;