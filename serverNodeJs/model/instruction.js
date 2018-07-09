var mongoose = require('mongoose');  
var instructionSchema = new mongoose.Schema({  
   description:String,
   createdAt:Date
  });
mongoose.model('instruction', instructionSchema,'instruction');