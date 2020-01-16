import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const configSchema = new mongoose.Schema({
  tagsLimitation:{type:Number,default:5},
  answersLimitation:{type:Number,default:5},
  deleted:{type:Boolean, default:false},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const Config = mongoose.model('Config', configSchema);

export default Config;
