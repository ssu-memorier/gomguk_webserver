const jwt = require('jsonwebtoken');
const {
    TOKEN_EXPIRED,
    TOKEN_INVALID,
    TOKEN_VERIFIED,
} = require('../src/constants/token');

module.exports = {
    issue: async (user) => {
        const payload = {
            email: user.email,
            provider: user.provider,
            accessToken: user.accessToken,
        };
        const result = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '6h',
        });

        return result;
    },
    verify: async (token) => {
        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            if (err.message === 'jwt expired') {
                return TOKEN_EXPIRED;
            } else {
                return TOKEN_INVALID;
            }
        }
        return TOKEN_VERIFIED;
    },
    getPayload: async (token) => {
        let payload = '';
        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            console.error(err);
        }
        return payload;
    },
};
