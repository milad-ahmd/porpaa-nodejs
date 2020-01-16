import * as mongoose from 'mongoose';

const smsSchema = new mongoose.Schema({
  "messageid": Number,
  "message":String,
  "status": Number,
  "statustext": String,
  "sender": String,
  "receptor": String,
  "date": Number,
  "cost": Number
});

const Sms = mongoose.model('Sms', smsSchema);

export default Sms;
