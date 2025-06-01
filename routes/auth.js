const express = require("express")
const router = express.Router()
// const Joi = require("joi")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const { User, authValidation } = require("../model/userModel")

// login
router.post("/", async (req, res) => {
    // input validation
    const error = authValidation.validate(req.body);
    if (error.error) {
        res.status(400).send(error.error.details[0].message);
        return
    }
    // system validation
    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Invalid email")

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) return res.status(400).send("Invalid password")

    // process
    const token = jwt.sign({ _id: user._id, biz: user.biz }, process.env.TOKEN_SECRET)

    // response
    res.header("auth-token", token).send(token)
})

module.exports = router