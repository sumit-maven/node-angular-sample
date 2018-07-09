var mongoose = require('mongoose');  
var feedbackSchema = new mongoose.Schema({  
   userId : String,
   userName: String,
   language:String,
   feedback:String,
   createdAt:Date
  });
mongoose.model('feedback', feedbackSchema,'feedback');