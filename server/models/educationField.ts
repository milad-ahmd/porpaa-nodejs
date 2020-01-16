import * as mongoose from 'mongoose';
import moment = require("moment-timezone");

const educationFieldSchema = new mongoose.Schema({
  title:String,
  deleted:{type:Boolean, default:false},
  created_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() },
  updated_at: { type: Number, "default": moment().tz('Asia/Tehran').unix() }
});

const EducationField = mongoose.model('EducationField', educationFieldSchema);

export default EducationField;
