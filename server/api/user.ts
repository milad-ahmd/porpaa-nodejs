import * as express from 'express'
import ApLogCtrl from '../controllers/apLog'
import UserCtrl from '../controllers/user'
import XpLogCtrl from '../controllers/xpLog'

const router = express.Router()
const xpCtrl = new XpLogCtrl()
const apCtrl = new ApLogCtrl()
const userCtrl = new UserCtrl()

router.route('/save').post(userCtrl.jwtTokenValidation, userCtrl.insert)
router.route('/update').put(userCtrl.jwtTokenValidation, userCtrl.update)
router.route('/all').get(userCtrl.getAll)
router.route('/filter').get(userCtrl.jwtTokenValidation, userCtrl.getByFilter)
router.route('/:id').get(userCtrl.jwtTokenValidation, userCtrl.get)
router.route('/user').put(userCtrl.jwtTokenValidation, userCtrl.update)
router.route('/setFriend').post(userCtrl.jwtTokenValidation, userCtrl.addFriend)
router.route('/friend/getFriend').get(userCtrl.jwtTokenValidation, userCtrl.getFriends)
router.route('/find/search').get(userCtrl.searchUserByEmail)
router.route('/points/xp').get(userCtrl.jwtTokenValidation, xpCtrl.getByFilter)
router.route('/points/xp/total').get(userCtrl.jwtTokenValidation, xpCtrl.getTotalXp)
router.route('/points/xp/total/users').get(userCtrl.jwtTokenValidation, xpCtrl.getTotalUsersXp)
router.route('/points/xp/chart').get(userCtrl.jwtTokenValidation, xpCtrl.getLastLogs)
router.route('/points/ap/chart').get(userCtrl.jwtTokenValidation, apCtrl.getLastLogs)
router.route('/points/ap').get(userCtrl.jwtTokenValidation, apCtrl.getByFilter)
router.route('/points/ap/total').get(userCtrl.jwtTokenValidation, apCtrl.getTotalAp)
router.route('/get/info').get(userCtrl.jwtTokenValidation, userCtrl.getUserInfo)
router.route('/get-one/:id').get(userCtrl.jwtTokenValidation, userCtrl.get)
router.route('').put(userCtrl.jwtTokenValidation, userCtrl.update)
router.route('/multiple').put(userCtrl.updateAll)

export default router
