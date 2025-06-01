const jwt = require("jsonwebtoken")
const { User } = require("../model/userModel")

// checks if the  token is valid
module.exports = async (req, res, next) => {
    const token = req.header("auth-token")
    if (!token) return res.status(401).send("Access denied")
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        if (!verified) return res.status(401).send("Access denied")
        req.user = verified
        let requestingUser = await User.findById(req.user._id)
        // in case there is a valid token but the user no longer exists
        if (!requestingUser) return res.status(403).send("User not found")
        req.requestingUser = requestingUser
        next()
    } catch (err) {
        console.log(err);
        res.status(400).send(err)
    }
}