import { ResponseContent } from '../base/responseContent'
import { XpLog } from '../helpers/xp'
import Playlist from '../models/playlist'
import Question from '../models/question'
import BaseCtrl from './base'


export default class PlaylistCtrl extends BaseCtrl {
  model = Playlist
  response: ResponseContent

  addPlaylist = (req, res) => {
    var playlist = req.body
    playlist.user = req.payload.user._id
    const obj = new this.model(playlist)
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
  addQuestionToPlaylist = (req, res) => {
    let playlist = req.body
    if (playlist._id&&playlist.question) {
      this.model.findOneAndUpdate({ _id: playlist._id }, { '$push': { 'questions': playlist.question } }, (err, playlist) => {
        if (err) {
          return res.send(err)
        }
        return res.status(200).json({ isSuccessful: true, data: playlist })
      })
    }
  }
  getMyPlaylist = (req, res) => {
    let user = req.payload.user._id
    var playlists_finder = { deleted: false }

    playlists_finder['user'] = user

    var playlists_populator = [
      { path: 'questions', model: 'Question' }
    ]
    this.model.find(playlists_finder).populate(playlists_populator).sort({ created_at: -1 }).exec((err, playlistss) => {
      if (err) {
        return res.send(404)
      }
      this.response = new ResponseContent(true, playlistss)
      if (playlistss) {
        return res.status(200).json(this.response)
      }
    })
  }

  removeOfPlaylist = (req, res) => {
    let user = req.payload.user._id
    var playlist_finder = { deleted: false }

    playlist_finder['user'] = user

    this.model.findById({_id:req.params.id}).exec((err,playlist)=>{
      playlist.questions=playlist.questions.splice(playlist.questions.indexOf(req.params.question),1)
      this.model.findOneAndUpdate(playlist, { '$set': { 'questions': playlist.questions } }, (err) => {
        if (err) {
          return res.send(err)
        } else {
          return res.status(200).json({ isSuccessful: true, data: true })
        }
      })
    })

  }
  removePlaylist = (req, res) => {
    let user = req.payload.user._id
    var playlist_finder = { deleted: false }

    playlist_finder['user'] = user
    playlist_finder['_id'] = req.params.id

    this.model.findOneAndUpdate(playlist_finder, { '$set': { 'deleted': true } }, (err) => {
      if (err) {
        return res.send(err)
      } else {
        return res.status(200).json({ isSuccessful: true, data: true })
      }
    })
  }
}
