import * as express from 'express'
import AnswerCtrl from './controllers/answer'
import ApLogCtrl from './controllers/apLog'
import BookmarkCtrl from './controllers/bookmark'
import CityCtrl from './controllers/city'
import CommentCtrl from './controllers/comment'
import ConfigCtrl from './controllers/config'
import DifficaltyCtrl from './controllers/difficalty'
import EducationFieldCtrl from './controllers/educationField'
import UploadCtrl from './controllers/fileupload'
import LevelCtrl from './controllers/level'
import MissionCardCtrl from './controllers/missionCard'
import NotificationCtrl from './controllers/notification'
import PlaylistCtrl from './controllers/playlist'
import QuestionCtrl from './controllers/question'
import ReportCtrl from './controllers/report'
import RequestEditCtrl from './controllers/requestEdit'
import RequestOtherCtrl from './controllers/requestOther'
import SchoolLevelCtrl from './controllers/schoolLevel'
import StateCtrl from './controllers/state'
import SubjectCtrl from './controllers/subject'
import TagsCtrl from './controllers/tags'
import UserCtrl from './controllers/user'
import ChallengeCtrl from './controllers/challenge'
import UserTypeCtrl from './controllers/usertype'
import XpLogCtrl from './controllers/xpLog'
import SmsUtil from './helpers/smsUtil'
import MQService from './workers/MQService'



import userRouter from "./api/user";

export default function setRoutes(app) {

  const router = express.Router()

  const userCtrl = new UserCtrl()
  const subjectCtrl = new SubjectCtrl()
  const cityCtrl = new CityCtrl()
  const bookmarkCtrl = new BookmarkCtrl()
  const stateCtrl = new StateCtrl()
  const configCtrl = new ConfigCtrl()
  const questionCtrl = new QuestionCtrl()
  const tagsCtrl = new TagsCtrl()
  const answerCtrl = new AnswerCtrl()
  const challengeCtrl = new ChallengeCtrl()
  const uploadCtrl = new UploadCtrl()
  const commentCtrl = new CommentCtrl()
  const reportCtrl = new ReportCtrl()
  const smsCtrl = new SmsUtil()
  const xpCtrl = new XpLogCtrl()
  const apCtrl = new ApLogCtrl()
  const educationFieldCtrl = new EducationFieldCtrl()
  const schoolLevelCtrl = new SchoolLevelCtrl()
  const levelCtrl = new LevelCtrl()
  const difficaltyCtrl = new DifficaltyCtrl()
  const notifCtrl = new NotificationCtrl()
  const playlistCtrl = new PlaylistCtrl()
  const requestEditCtrl = new RequestEditCtrl()
  const userTypeCtrl = new UserTypeCtrl()
  const requestOtherCtrl = new RequestOtherCtrl()
  const missionCardCtrl = new MissionCardCtrl()


  // function (req, res, next) { userCtrl.jwtTokenValidation(req, res, next, ['superadmin', 'admin', 'user', 'agent', 'encoder', 'van-driver', 'tour-guide', 'company']) },

  // Users
  router.route('/login').post(userCtrl.login)
  router.route('/login/admin').post(userCtrl.loginAdmin)
  router.route('/register').post(userCtrl.register)
  router.route('/verify').post(userCtrl.verify)
  router.route('/resend').post(userCtrl.resendCode)
  router.route('/refreshToken').get(userCtrl.jwtTokenValidation, userCtrl.refreshToken)
  router.route('/forgetPassword').post( userCtrl.forgetPassword)
  router.route('/resetPassword').post( userCtrl.resetPassword)


  //Subjects
  router.route('/subject/save').post(userCtrl.jwtTokenValidation,subjectCtrl.insert)
  router.route('/subject/all').get(subjectCtrl.getAll)
  router.route('/subject/filter').get(subjectCtrl.getByFilter)
  router.route('/subject/:id').get(subjectCtrl.get)
  router.route('/subject/update').put(userCtrl.jwtTokenValidation,subjectCtrl.update)

  //city
  router.route('/city/save').post(cityCtrl.insert)
  router.route('/city/all').get(cityCtrl.getAll)
  router.route('/city/filter').get(cityCtrl.getByFilter)
  router.route('/city/:id').get(cityCtrl.get)
  router.route('/city/update').put(cityCtrl.update)

  //state
  router.route('/state/save').post(stateCtrl.insert)
  router.route('/state/all').get(stateCtrl.getAll)
  router.route('/state/filter').get(stateCtrl.getByFilter)
  router.route('/state/:id').get(stateCtrl.get)
  router.route('/state/update').put(stateCtrl.update)

  //tags
  router.route('/tags/save').post(tagsCtrl.insert)
  router.route('/tags/all').get(tagsCtrl.getAll)
  router.route('/tags/filter').get(tagsCtrl.getByFilter)
  router.route('/tags/:id').get(tagsCtrl.get)
  router.route('/tags/update').put(tagsCtrl.update)

  //education field
  router.route('/education-field/save').post(educationFieldCtrl.insert)
  router.route('/education-field/all').get(educationFieldCtrl.getAll)
  router.route('/education-field/filter').get(educationFieldCtrl.getByFilter)
  router.route('/education-field/:id').get(educationFieldCtrl.get)
  router.route('/education-field/update').put(educationFieldCtrl.update)

  //school level
  router.route('/school-level/save').post(schoolLevelCtrl.insert)
  router.route('/school-level/all').get(schoolLevelCtrl.getAll)
  router.route('/school-level/filter').get(schoolLevelCtrl.getByFilter)
  router.route('/school-level/:id').get(schoolLevelCtrl.get)
  router.route('/school-level/update').put(schoolLevelCtrl.update)

  //level
  router.route('/level/save').post(levelCtrl.insert)
  router.route('/level/all').get(levelCtrl.getAll)
  router.route('/level/filter').get(levelCtrl.getByFilter)
  router.route('/level/:id').get(levelCtrl.get)
  router.route('/level/update').put(levelCtrl.update)
  router.route('/level/get/currentMission/:levelId').put(levelCtrl.getCurrentLevelMissionCard)


  //missionCard
  router.route('/missionCard/save').post(missionCardCtrl.insert)
  router.route('/missionCard/all').get(missionCardCtrl.getAll)
  router.route('/missionCard/filter').get(missionCardCtrl.getByFilter)
  router.route('/missionCard/:id').get(missionCardCtrl.get)
  router.route('/missionCard/update').put(missionCardCtrl.update)


  //usertype
  router.route('/userType/save').post(userTypeCtrl.insert)
  router.route('/userType/all').get(userTypeCtrl.getAll)
  router.route('/userType/filter').get(userTypeCtrl.getByFilter)
  router.route('/userType/:id').get(userTypeCtrl.get)
  router.route('/userType/update').put(userTypeCtrl.update)

  //challenge
  router.route('/challenge/save').post(userCtrl.jwtTokenValidation,challengeCtrl.insert)
  router.route('/challenge/all').get(challengeCtrl.getAll)
  router.route('/challenge/filter').get(challengeCtrl.getByFilter)
  router.route('/challenge/:id').get(challengeCtrl.get)
  router.route('/challenge/update').put(userCtrl.jwtTokenValidation,challengeCtrl.update)
  router.route('/challenge/start').post(userCtrl.jwtTokenValidation,challengeCtrl.start)
  router.route('/challenge/get/my-challenges').get(userCtrl.jwtTokenValidation,challengeCtrl.getMyActiveChallenge)
  router.route('/challenge/get/my-active-challenges').get(userCtrl.jwtTokenValidation,challengeCtrl.getMyActiveChallenge)
  router.route('/challenge/get/my-finish-challenges').get(userCtrl.jwtTokenValidation,challengeCtrl.getMyFinishedChallenge)
  router.route('/challenge/get/my-expired-challenges').get(userCtrl.jwtTokenValidation,challengeCtrl.getMyExpiredChallenge)

  //question
  router.route('/question/save').post(userCtrl.jwtTokenValidation,questionCtrl.insertQuestion)
  router.route('/question/all').get(userCtrl.jwtTokenValidation,questionCtrl.getQuestions)
  router.route('/question/filter/:page/:limit').get(questionCtrl.getQuestionByFilterPagination)
  router.route('/question/:id').get(questionCtrl.getOne)
  router.route('/question/like/:id').post(userCtrl.jwtTokenValidation,questionCtrl.likeQuestion)
  router.route('/question/update').put(userCtrl.jwtTokenValidation,questionCtrl.updateQuestion)


  //answers
  router.route('/answer/save').post(userCtrl.jwtTokenValidation,answerCtrl.insertAnswer)
  router.route('/answer/status').put(userCtrl.jwtTokenValidation,answerCtrl.changeAnswerStatus)
  router.route('/answer/like/:id').post(userCtrl.jwtTokenValidation,answerCtrl.likeAnswer)
  router.route('/answer/filter/:page/:limit').get(answerCtrl.getAnswerByFilterPagination)


  //bookmarks
  router.route('/bookmark/save').post(userCtrl.jwtTokenValidation,bookmarkCtrl.addBookmark)
  router.route('/bookmark/my-bookmark').get(userCtrl.jwtTokenValidation,bookmarkCtrl.getAllBookmarkByUser)
  router.route('/bookmark/delete').delete(userCtrl.jwtTokenValidation,bookmarkCtrl.removeOfBookmark)



  //difficalty
  router.route('/difficalty/save').post(userCtrl.jwtTokenValidation,difficaltyCtrl.saveDifficalty)
  router.route('/difficalty/filter').get(userCtrl.jwtTokenValidation,difficaltyCtrl.getByFilter)



  //notification
  router.route('/notification/filter').get(userCtrl.jwtTokenValidation,notifCtrl.getByFilter)


  //comment
  router.route('/comment/:type/save').post(userCtrl.jwtTokenValidation,commentCtrl.insertComment)
  router.route('/comment/all').get(userCtrl.jwtTokenValidation,commentCtrl.getAll)
  router.route('/comment/filter').get(commentCtrl.getByFilter)
  router.route('/comment/:id').get(userCtrl.jwtTokenValidation,commentCtrl.get)
  router.route('/comment/update').put(userCtrl.jwtTokenValidation,commentCtrl.update)

  //report
  router.route('/report/:type/save').post(userCtrl.jwtTokenValidation,reportCtrl.insertReport)
  router.route('/report/all').get(userCtrl.jwtTokenValidation,reportCtrl.getAll)
  router.route('/report/filter').get(reportCtrl.getByFilter)
  router.route('/report/:id').get(userCtrl.jwtTokenValidation,reportCtrl.get)
  router.route('/report/update').put(userCtrl.jwtTokenValidation,reportCtrl.update)



  //request others
  router.route('/request-other/save').post(userCtrl.jwtTokenValidation,requestOtherCtrl.addRequestForOther)
  router.route('/request-other/all').get(userCtrl.jwtTokenValidation,requestOtherCtrl.getAll)
  router.route('/request-other/filter').get(requestOtherCtrl.getByFilter)
  router.route('/request-other/:id').get(userCtrl.jwtTokenValidation,requestOtherCtrl.get)
  router.route('/request-other/update').put(userCtrl.jwtTokenValidation,requestOtherCtrl.update)


  //playlist
  router.route('/playlist/save').post(userCtrl.jwtTokenValidation,playlistCtrl.addPlaylist)
  router.route('/playlist/question/save').post(userCtrl.jwtTokenValidation,playlistCtrl.addQuestionToPlaylist)
  router.route('/playlist/my-playlist').get(userCtrl.jwtTokenValidation,playlistCtrl.getMyPlaylist)
  router.route('/playlist/:id/question/:question').delete(userCtrl.jwtTokenValidation,playlistCtrl.removeOfPlaylist)
  router.route('/playlist/:id').delete(userCtrl.jwtTokenValidation,playlistCtrl.removePlaylist)




  //requestEdit
  router.route('/request-edit/save').post(userCtrl.jwtTokenValidation,requestEditCtrl.addRequestForEdit)
  router.route('/request-edit/change/status').put(userCtrl.jwtTokenValidation,requestEditCtrl.changeRequestEditStatus)
  router.route('/request-edit/filter').get(userCtrl.jwtTokenValidation,requestEditCtrl.getRequestToEdit)



  router.route('/sms').get(function (req,res) {
    var mq = new MQService();

    return mq.publish(mq.Q_CHALLENGE, {}).then(result=>res.status(200).json({date:new Date().getTime()})).catch(err=>console.error(err));

//    smsCtrl.sendSmsRegisteration('09910760978','dsfdsf','میلاد')
  })
  //config
  router.route('/config/save').post(configCtrl.insert)
  router.route('/config/filter').get(configCtrl.getByFilter)

  router.route('/upload').post(uploadCtrl.upload)



  // Apply the routes to application with the prefix /api
  app.use('/api', router)
  app.use('/api/user', userRouter)

}
