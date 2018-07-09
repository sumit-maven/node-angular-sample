var mongoose = require('mongoose');  
var assessquesSchema = new mongoose.Schema({  
	questionId : String,
	memberId:String,
	groupId:String,
	language:String,
	questionType: String,
	questionText : String, 
	quesImgUrl : String, 
	categoryName : String,
	marks : Number,
	createdDate : Date, 
	updatedDate : Date,    
	userGroupId : String,
	answers : Array
});
mongoose.model('assessques', assessquesSchema,'assessques');