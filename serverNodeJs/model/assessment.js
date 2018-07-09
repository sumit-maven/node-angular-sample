var mongoose = require('mongoose');  
var assessmentSchema = new mongoose.Schema({  
	assessmentId:String,
	assessmentName:String,
	level:String,
	categoryName:String,
	language:String,
	groupName:String,
	timePeriod:String,
	totalMarks:String,
	passingMarks:String,
	createDate: Date,
	updateDate: Date
});
mongoose.model('assessment', assessmentSchema,'assessment');