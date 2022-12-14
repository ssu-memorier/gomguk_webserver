const express = require('express');
const passport = require('passport');
const jwt = require('../../../modules/jwt');
const { JWT } = require('../../constants/token');
const router = express.Router();

router.get('/', passport.authenticate('kakao'));
router.get(
    '/callback',
    passport.authenticate('kakao', { session: false, failureRedirect: '/' }),
    async (req, res) => {
        try {
            const jwtToken = await jwt.issue(req.user);
            res.cookie(JWT, jwtToken, {
                domain: '.paas-ta.org',
                httpOnly: true,
                secure: true,
            }).redirect('/');
        } catch (err) {
            console.error(err);
        }
    }
);

module.exports = router;
