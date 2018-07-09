var mongoose = require('mongoose');  
var userstokenSchema = new mongoose.Schema({  
	userId:String,
	userName:String,
	userType:String,
	tokenId : String,
	createdDate  : Date
});
mongoose.model('userstoken', userstokenSchema,'userstoken');