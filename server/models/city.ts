import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const citySchema = new mongoose.Schema({
    name:String,
    state:String,
    deleted:{type:Boolean, default:false},
    created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
    updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});
citySchema.virtual('stateData', {
    ref: 'State',
    localField: 'state',
    foreignField: '_id',
    justOne: true
});
const City = mongoose.model('City', citySchema);

export default City;
