const express = require('express');
const User = require('../../../models/user');
const logoutModules = require('../../../modules/oauth/logout');
const kakaoRouter = require('./kakaoAuth');
const googleRouter = require('./googleAuth');
const validTokenRouter = require('./validToken');

const { JWT } = require('../../constants/token');
const { getPayloadFromJWT } = require('../../utils/getPayloadFromJWT');

const router = express.Router();

router.use('/kakao', kakaoRouter);
router.use('/google', googleRouter);
router.use('/valid-token', validTokenRouter);

router.get('/profile', async (req, res) => {
    try {
        const jwt = await req.cookies.jwt;
        const payload = await getPayloadFromJWT(jwt);
        const user = await User.findOne({
            where: {
                email: payload.email,
                provider: payload.provider,
            },
        });
        res.status(200).json({
            code: 200,
            name: user.name,
        });
    } catch (err) {
        return res.status(401).json({
            code: 401,
            msg: '401 unauthorized',
        });
    }
});

router.get('/logout', async (req, res) => {
    const jwt = await req.cookies.jwt.token;
    const jwtPayload = await getPayloadFromJWT(jwt);
    if (jwtPayload.provider === 'kakao') {
        logoutModules.kakao(jwtPayload.accessToken);
    } else {
        logoutModules.google(jwtPayload.accessToken);
    }
    res.cookie(JWT, null, { maxAge: 0 });
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;
