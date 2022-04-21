const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'cUWt#2CCQr%00B]uPDXiR|$N:p7J`F');
        const userId = decodedToken.userId;
        if (req.body?.userId!=="undefined" && req.body?.userId !== userId) {
            console.log(req.body.userId)
            req.body.userId = userID
            throw 'Invalid user ID';

        } else {
            next();
        }
    } catch {
        res.status(401).json({
            error: ('Invalid request!')
        });
    }
};