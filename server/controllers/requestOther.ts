import { ResponseContent } from '../base/responseContent'
import { NotificationClass } from '../helpers/notificationClass'
import RequestOther from '../models/requestOther'
import BaseCtrl from './base'


export default class RequestOtherCtrl extends BaseCtrl {
  model=RequestOther;
  response: ResponseContent;
  notif:NotificationClass;

  addRequestForOther=(req,res)=>{
    var requestOther = req.body
    requestOther.requester = req.payload.user._id
    const obj = new this.model(requestOther)
    obj.save((err, item) => {
      if (err && err.code === 11000) {
        res.sendStatus(400)
      }
      if (err) {
        return res.send(err)
      }
      let self=this;
      requestOther.users.forEach((sub,i)=>{
        self.notif=new NotificationClass(sub,`${req.payload.user.username} request to you for accept`,'Request-other',{question:requestOther.question})

        if(i===requestOther.users.length-1){
          this.response = new ResponseContent(true, item)
          return res.status(200).json(this.response)
        }
      })

    })
  }
}
