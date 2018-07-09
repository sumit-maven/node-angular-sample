var mongoose = require('mongoose');  
var answersSchema = new mongoose.Schema({  
	questionId:String,
	userId:String,
	postedBy:String,
	language:String,
	answeredBy:String,
	answerId:String,
	answers:String,
	upVote : Number,
	downVote : Number,
	comments: String,
	userComments:Array,
	userImage:String,
	createdDate: Date,
	updatedDate: Date,
	upVoted:Array,
	answerImageUrl:String,
	compliance:String,
	mlprocess:String,
	notificationSend:Boolean
});
mongoose.model('answers', answersSchema,'answers');
