import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const tagsSchema = new mongoose.Schema({
    name:String,
    deleted:{type:Boolean, default:false},
    created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Tags = mongoose.model('Tags', tagsSchema);

export default Tags;
