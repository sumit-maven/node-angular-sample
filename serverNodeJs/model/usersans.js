var mongoose = require('mongoose');  
var usersansSchema = new mongoose.Schema({  
  socialId:String,
  assessmentId : String,  
  answerDetail : Object ,
  createdDate:Date,
  updatedDate:Date
});
mongoose.model('usersans', usersansSchema,'usersans');