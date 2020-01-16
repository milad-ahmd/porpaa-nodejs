import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const levelSchema = new mongoose.Schema({
    name:String,
    icon:String,
    points:Number,
    order:Number,
    deleted:{type:Boolean, default:false},
    created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Level = mongoose.model('Level', levelSchema);

export default Level;
