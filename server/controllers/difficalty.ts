import { ResponseContent } from '../base/responseContent'
import { LimitationType } from '../helpers/limitationType'
import RateLimitations from '../helpers/rate-limitations'
import BaseCtrl from './base'
import Answer from '../models/answer'
import Difficalty from '../models/difficalty'


export default class DifficaltyCtrl extends BaseCtrl {
  model = Difficalty
  response : ResponseContent

  saveDifficalty = (req, res) => {
    var difficalty = req.body
    difficalty.user = req.payload.user._id
    const obj = new this.model(difficalty)
    obj.save((err, item) => {
      if (err && err.code === 11000) {
        res.sendStatus(400)
      }
      if (err) {
        return res.send(err)
      }
      this.response = new ResponseContent(true, item)

      res.status(200).json(this.response)
    })
  }
}
