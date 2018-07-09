var mongoose = require('mongoose');  
var groupSchema = new mongoose.Schema({  
	groupId:String,
	membersIds: Array,
	groupName:String,
	 categoryId:String,
	categoryName: String,
	groupImage:String,
	technology:String,
	language:String,
	tags:Array,
	noOfQues:String,
	noOfMembers: String,
	noOfAns: String,
	noOfSMEs: String,
	noOfFavorite:String,
	SMEsType:String,
	groupStatus:String,
	groupFollower:Array,
	createdDate:Date,
	updatedDate:Date
});
mongoose.model('group', groupSchema,'group');