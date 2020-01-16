import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const commentSchema = new mongoose.Schema({
    //TODO
    text:String,
    user:String,
    answer:String,
    question:String,
    report:{type:String,enum:['im_report','normal','no_report','block']},
    type:{type:String,enum:['answer','question']},
    visible:{type:Boolean, default:true},
    deleted:{type:Boolean, default:false},
    created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
