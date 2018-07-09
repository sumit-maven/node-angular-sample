var mongoose = require('mongoose');  
var reportSchema = new mongoose.Schema({  
      userId:String,
      userName :String,
      userImage:String,
      questionId : String,  
	  language: String,
	  incorrectTopicText: String,
      poorlyWrittenText: String,
      createdDate:Date,
      insincereText:String
});
mongoose.model('report', reportSchema,'report');