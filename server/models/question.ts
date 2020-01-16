import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const questionSchema = new mongoose.Schema({
    title:String,
    description:String,
    subject:String,
    user:String,
    difficalty:{type:String,enum:['easy','medium','hard']},
    tags:[String],
    likes:Number,
    likers:[],
    answers:[String],
    comments:[String],
    report:{type:String,enum:['im_report','normal','no_report','block']},
    deleted:{type:Boolean, default:false},
    lifecycle: { type: Number, "default": moment().tz('Asia/Tehran').unix()+(14*24*60*60) },
    created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

questionSchema.virtual('userData', {
    ref: 'User',
    localField: 'user',
    foreignField: '_id',
    justOne: true
});

questionSchema.virtual('subjectData', {
    ref: 'Subject',
    localField: 'subject',
    foreignField: '_id',
    justOne: true
});
// questionSchema.virtual('tagsData', {
//     ref: 'Tags',
//     localField: 'tags',
//     foreignField: '_id',
//     justOne: true
// });
questionSchema.virtual('answersData', {
    ref: 'Answer',
    localField: 'answers',
    foreignField: '_id',
    justOne: true
});questionSchema.virtual('commentsData', {
    ref: 'Comments',
    localField: 'comments',
    foreignField: '_id',
    justOne: true
});

const Question = mongoose.model('Question', questionSchema);

export default Question;
