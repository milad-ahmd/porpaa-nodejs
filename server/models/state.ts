import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const stateSchema = new mongoose.Schema({
    name:String,
    deleted:{type:Boolean, default:false},
    created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const State = mongoose.model('State', stateSchema);

export default State;
