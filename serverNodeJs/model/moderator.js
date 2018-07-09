var mongoose = require('mongoose');  
var moderatorSchema = new mongoose.Schema({  
	groupId:String,
	categoryName:Array,
	groupName:String,
	language:String,
	modId:String,
	modName: String,
	email:String,
	password:String,
	assignedGrps:Array,
	modStatus:String,
	createdDate:Date,
	updatedDate:Date
});
mongoose.model('moderator',moderatorSchema,'moderator');