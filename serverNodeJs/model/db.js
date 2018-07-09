var mongoose = require('mongoose');
console.log("rj database connect");
mongoose.connect('mongodb://localhost:11000/baduga', { useMongoClient: true });
// mongoose.connect('mongodb://localhost:11000/badugaChat', { useMongoClient: true });
