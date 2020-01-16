import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const reportSchema = new mongoose.Schema({
    reviewer:String,
    reporter:String,
    question_comment:String,
    answer_comment:String,
    question:String,
    answer:String,
    type:{type:String,enum:['question_comment','question','answer','answer_comment']},
    status:{type:String,enum:['reject','verify']},
    reason:{type:String,enum:['A','B','C','D','E','F','G','H']},
    reasonDetail:String,
    deleted:{type:Boolean, default:false},
    report_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    reviewed_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Report = mongoose.model('Report', reportSchema);

export default Report;
