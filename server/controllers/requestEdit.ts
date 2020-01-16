import { ResponseContent } from '../base/responseContent'
import { XpLog } from '../helpers/xp'
import RequestEdit from '../models/requestEdit'
import BaseCtrl from './base'


export default class RequestEditCtrl extends BaseCtrl {
  model=RequestEdit
  response: ResponseContent

  addRequestForEdit=(req,res)=>{
    var requestEdit = req.body
    requestEdit.user = req.payload.user._id
    const obj = new this.model(requestEdit)
    obj.save((err, item) => {
      if (err && err.code === 11000) {
        res.sendStatus(400)
      }
      if (err) {
        return res.send(err)
      }
      this.response = new ResponseContent(true, item)
          return res.status(200).json(this.response)
    })
  }
  getRequestToEdit=(req,res)=>{
    let user = req.payload.user
    let requestEdit_finder = req.query;

    requestEdit_finder['deleted'] = false;
    var requestEdit_populator = [
      { path: 'question', model: 'Question' }
    ]
    if(user.role=='moderator'){
      this.model.find(requestEdit_finder).populate(requestEdit_populator).sort({ created_at: -1 }).exec((err, requestEdits) => {
        if (err) {
          return res.send(404)
        }
        if (requestEdits) {
          this.response = new ResponseContent(true, requestEdits)
          return res.status(200).json(this.response)
        }
      })
    }else{
      return res.status(403)
    }
  }
  changeRequestEditStatus = (req, res) => {
    let user = req.payload.user
    if(user.role=='moderator') {
      let requestEdit = req.body
      if (requestEdit._id) {
        this.model.findOneAndUpdate({ _id: requestEdit._id }, { '$set': { status: requestEdit.status } }, (err, answer) => {
          if (err) {
            return res.send(err)
          }
          return res.status(200).json({ isSuccessful: true, data: answer })
        })
      }
    }else{
      return res.status(403)
    }
  }
}
