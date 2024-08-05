const jwt = require('jsonwebtoken');
const generateJwt = (payload) => {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' }, (err, token) => {
            if (err) {
                console.log(err);
                reject('Error generating token');
            }
            resolve(token);
        });
    });

    
}

module.exports = generateJwt