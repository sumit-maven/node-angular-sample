var mongoose = require('mongoose');  
var adminSchema = new mongoose.Schema({  
	adName:String,
	adminId:String,
	userName:String,
	password: String,
	roles:String,
	language:String,
	createdDate: Date,
	updatedDate: Date
});
mongoose.model('admin', adminSchema,'admin');