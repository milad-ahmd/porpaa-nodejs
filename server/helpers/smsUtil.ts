import { KAVANDEGAR_API_KEY } from '../constants'
import Sms from '../models/Sms'


const request = require('request-promise');

// {
//   "return": {
//   "status": 200,
//     "message": "تایید شد"
// },
//   "entries": [
//   {
//     "messageid": 8792343,
//     "message": "خدمات پیام کوتاه کاوه نگار",
//     "status": 1,
//     "statustext": "در صف ارسال",
//     "sender": "10004346",
//     "receptor": "09125258596",
//     "date": 1356619709,
//     "cost": 120
//   },
//   {
//     "messageid": 8792344,
//     "message": "خدمات پیام کوتاه کاوه نگار",
//     "status": 1,
//     "statustext": "در صف ارسال",
//     "sender": "10004346",
//     "receptor": "09128585774",
//     "date": 1356619709,
//     "cost": 120
//   }
// ]
// }
export default class SmsUtil {
  model=Sms
  sendSmsRegisteration=(phone,code,username)=>{
    return new Promise((resolve)=>{
      const options = {
        method: 'GET',
        uri: `https://api.kavenegar.com/v1/${KAVANDEGAR_API_KEY}/verify/lookup.json`,
        qs: {
          token:username,
          token2:code,
          template:'verify',
          receptor:phone

        },
        json: true
      };
      request(options).then(response => {
        console.log(response);
        if(response.return.status===200){
          const obj = new this.model(response.entries[0]);
          obj.save((err, item) => {
            // 11000 is the code for duplicate key error
            if (err && err.code === 11000) {
              resolve(false);
            }
            if (err) {
              resolve(false);
            }
            resolve(true)
          });
        }
      }).catch(err=>{
        console.log(err)
      })
    })
  }
}
