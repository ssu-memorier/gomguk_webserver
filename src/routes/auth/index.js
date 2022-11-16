const express = require('express');
const jwt = require('../../../modules/jwt');
const User = require('../../../models/user');
const logoutModules = require('../../../modules/oauth/logout');

const kakaoRouter = require('./kakaoAuth');
const googleRouter = require('./googleAuth');

const router = express.Router();

router.use('/kakao', kakaoRouter);
router.use('/google', googleRouter);

router.get('/profile', async (req, res) => {
    try {
        const payload = await jwt.getPayload(req.cookies.jwt.token);
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
    const jwtPayload = await getPayload(req);
    if (jwtPayload.provider === 'kakao') {
        logoutModules.kakao(jwtPayload.accessToken);
    } else {
        logoutModules.google(jwtPayload.accessToken);
    }
    res.cookie('jwt', null, { maxAge: 0 });
    req.logout(() => {
        res.redirect('/');
    });
});

const getPayload = async (req) => {
    const payload = await jwt.getPayload(req.cookies.jwt.token);
    return payload;
};

module.exports = router;