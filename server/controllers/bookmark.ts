import { ResponseContent } from '../base/responseContent'
import { XpLog } from '../helpers/xp'
import Bookmark from '../models/bookmark'
import BaseCtrl from './base'
import XpLogCtrl from './xpLog'


const xpConfig = require('../helpers/xpConfig')
const xpCtrl = new XpLogCtrl()

export default class BookmarkCtrl extends BaseCtrl {
  model = Bookmark
  response: ResponseContent
  xp: XpLog
  addBookmark = (req, res) => {
    var bookmark = req.body
    bookmark.user = req.payload.user._id
    const obj = new this.model(bookmark)
    obj.save((err, item) => {
      if (err && err.code === 11000) {
        res.sendStatus(400)
      }
      if (err) {
        return res.send(err)
      }
      this.response = new ResponseContent(true, item)
      this.xp = new XpLog(bookmark.user, xpConfig.bookmark, 'bookmark')
      xpCtrl.saveXpLog(this.xp).then(xpRes => {
        if (xpRes) {
          res.status(200).json(this.response)
        }
      }).catch(err => {

      })
    })
  }
  getAllBookmarkByUser = (req, res) => {
    let user = req.payload.user._id
    var bookmark_finder = { deleted: false,user:user }

    var bookmark_populator = [
      { path: 'question', model: 'Question' }
    ]
    this.model.find(bookmark_finder).populate(bookmark_populator).sort({ created_at: -1 }).exec((err, bookmarks) => {
      if (err) {
        return res.send(404)
      }
      this.response = new ResponseContent(true, bookmarks)
      if (bookmarks) {
        return res.status(200).json(this.response)
      }
    })
  }
  removeOfBookmark = (req, res) => {
    let user = req.payload.user._id
    var bookmark_finder = { deleted: false,_id:req.query._id }

    bookmark_finder['user'] = user
    if (req.query.question) {
      bookmark_finder['question'] = req.query.question
    }
    this.model.findOneAndUpdate(bookmark_finder, { '$set': { 'deleted': true } }, (err) => {
      if (err) {
        return res.send(err)
      } else {
        return res.status(200).json({ isSuccessful: true, data: true })
      }
    })
  }
}
