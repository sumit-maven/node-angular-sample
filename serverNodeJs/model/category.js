var mongoose = require('mongoose');  
var categorySchema = new mongoose.Schema({  
    categoryId:String,
    categoryName:String,
    groupName :Array,
    language:String,
    catImage:String,
    categoryImage:String,
    tags:Array,
    noOfQues:String,
    noOfGroups:String,
    noOfSMEs: String,
    noOfFavorite:String,
    SMEsType:String,
    catStatus:String,
    bookMarkCategory:Array,
    createdDate:Date,
    updatedDate:Date
});
mongoose.model('category', categorySchema,'category');