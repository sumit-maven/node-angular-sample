var mongoose = require('mongoose');  
var reportSchema = new mongoose.Schema({  
      userId:String,
      userName :String,
      userImage:String,
      abusiveUserName : String,  
	  abusiveUserId: String,
	  abusiveText: String,
	  abusiveUserImage:String,
	  language:String,
      createdDate:Date
});
mongoose.model('userreport', reportSchema,'userreport');