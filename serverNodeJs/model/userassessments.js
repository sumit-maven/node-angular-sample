var mongoose = require('mongoose');  
var usersassessSchema = new mongoose.Schema({  
	userQuizId:String,
	socialId: String,
	assessmentId: String,
	obtainedMarks: String,       
	startTime:String,
	finishTime:String,
	status: String,
	submitType:String,
	createdDate:Date,
	updateDate:Date
});
mongoose.model('userassessments', usersassessSchema,'userassessments');