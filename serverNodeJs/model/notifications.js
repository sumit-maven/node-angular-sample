var mongoose = require('mongoose');  
var notificationsSchema = new mongoose.Schema({  
	message:String,
	userId:String,
	imageUrl:String,
	language:String,
	tokenId:String,
    createdDate:Date
});
mongoose.model('notifications', notificationsSchema,'notifications');