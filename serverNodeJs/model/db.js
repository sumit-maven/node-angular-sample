var mongoose = require('mongoose');
console.log("shubha database connect");
mongoose.connect('mongodb://localhost:29000/serverNodeJs', { useMongoClient: true });

