const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(JSON.parse(token), process.env.JWT_SECRET);
        req.body.authorId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed!" });
    }
}