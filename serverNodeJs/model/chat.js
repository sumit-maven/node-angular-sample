var mongoose = require('mongoose');  
var chatSchema = new mongoose.Schema({  
	userId:String,
	msg:String,
	username:String,
	language: String,
	createdDate:Date
});
mongoose.model('chat', chatSchema,'chat');