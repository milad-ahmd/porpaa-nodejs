import * as njwt from 'njwt'

export default new class JWTCtrl {

    create = (obj: Object) => {
        const signingKey = 'catswillruletheworld';
        // const timeout = new Date().getTime() + process.env.TIMEOUT
        const jwt = njwt.create(obj, signingKey)
        // jwt.setExpiration(timeout)
        jwt.setExpiration(new Date().getTime() + (60*60*10*1000)); // 10 Hours from now
        return jwt.compact()
    }
    createAdminToken = (obj: Object) => {
        const signingKey = 'catswillruletheworld';
        // const timeout = new Date().getTime() + process.env.TIMEOUT
        const jwt = njwt.create(obj, signingKey)
        // jwt.setExpiration(timeout)
        jwt.setExpiration(new Date().getTime() + (30*24*60*60*1000)); // one month from now
        return jwt.compact()
    }
    createRefreshToken = (obj: Object) => {
        const signingKey = 'catswillruletheworldrefresh';
        const jwt = njwt.create(obj, signingKey)
        jwt.setExpiration(new Date().getTime() + (30*60*60*24*1000)); // One month from now
        return jwt.compact()
    }

    verify = (token: string) => {
        try {
            const signingKey = process.env.SECRET_TOKEN
            return njwt.verify(token, signingKey).body
        } catch (error) {
            return error
        }
    }
}

