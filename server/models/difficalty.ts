import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const difficaltySchema = new mongoose.Schema({
    user:String,
    question:String,
    difficalty:{type:String,enum:['easy','medium','hard']},
    deleted:{type:Boolean, default:false},
    created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Difficalty = mongoose.model('Difficalty', difficaltySchema);

export default Difficalty;
