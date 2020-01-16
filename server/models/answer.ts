import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const answerSchema = new mongoose.Schema({
    description:String,
    comments:[String],//Object Id
    likers:[],
    likes:Number,
    user:String,
    question:String,
    status:{type:String,enum:['accepted','reported','normal','denied'],default:'normal'},
    deleted:{type:Boolean, default:false},
    created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Answer = mongoose.model('Answer', answerSchema);

export default Answer;
