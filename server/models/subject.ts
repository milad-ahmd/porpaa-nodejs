import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const subjectSchema = new mongoose.Schema({
    name:String,
    icon:String,
    deleted:{type:Boolean, default:false},
    created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;
