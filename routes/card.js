const express = require("express")
const router = express.Router()
const _ = require("lodash")

const defaultImage = "https://chisellabs.com/glossary/wp-content/uploads/2021/07/business-to-business.png"
const defaultImageObject = { url: defaultImage, alt: "business image" }

const { Card, cardValidation } = require("../model/cardModel")
// const {User} = require("../model/userModel")

const authMD = require("../middleware/authMD");



// delete card
router.delete("/:id", authMD, async (req, res) => {
    try {
        if (!req.requestingUser) return res.status(401).send("Please login first");
        if (!req.requestingUser.isBusiness) return res.status(403).send("You are not a business");

        const query = { _id: req.params.id };
        if (!req.requestingUser.isAdmin) {
            query.user_id = req.requestingUser._id;
        }

        const card = await Card.findOneAndDelete(query);
        if (!card) return res.status(404).send("Card not found");

        res.send({ message: "Card deleted", card: card });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});

// edit card
router.put("/:id", authMD, async (req, res) => {

    // validate user input
    const error = cardValidation.validate(req.body);
    if (error.error) {
        res.status(400).send(error.error.details[0].message);
        return
    }

    // validate system
    if (!req.requestingUser) return res.status(400).send("Please login first")
    if (!req.requestingUser.isBusiness) return res.status(400).send("You are not a business")


    // process
    let card = await Card.findOneAndUpdate({ _id: req.params.id, user_id: req.requestingUser._id }, { ...req.body, user_id: req.requestingUser._id, image: req.body.image ?? defaultImageObject }, { new: true })

    if (!card) return res.status(404).send("Card not found")

    res.send({ message: "Card updated", card: card })
})

// toggle like 
router.patch("/:id", authMD, async (req, res) => {
    // validate system
    if (!req.requestingUser) return res.status(400).send("Please login first")

    // process
    // get card
    let card = await Card.findById(req.params.id)
    if (!card) return res.status(404).send("Card not found")

    // Check if user already liked
    const userId = req.requestingUser._id;
    const userIdString = userId.toString(); // Convert to string for reliable comparison

    const userLikedIndex = card.likes.findIndex(id => id.toString() === userIdString);

    if (userLikedIndex > -1) {
        // User already liked, so remove the like
        card.likes.pull(userId);
    } else {
        // User hasn't liked, so add the like
        card.likes.push(userId);
    }

    // Save the updated card
    await card.save();

    res.send({ message: "Card updated", card: card })
})

// get the requesting user cards
router.get("/my-cards", authMD, async (req, res) => {
    let cards = await Card.find({ user_id: req.requestingUser._id })

    if (!cards) return res.status(404).send("No cards found")

    res.send({ message: "Cards found", cards: cards })
})

// get card info (anyone can)
router.get("/:id", async (req, res) => {
    let card = await Card.findById(req.params.id)

    if (!card) return res.status(404).send("Card not found")

    res.send(card)
})

// get all cards (anyone can)
router.get("/", async (req, res) => {
    let cards = await Card.find()

    if (!cards) return res.status(404).send("No cards found")

    res.send(cards)
})

// create card
router.post("/", authMD, async (req, res) => {
    // validate input
    const error = cardValidation.validate(req.body);
    if (error.error) {
        res.status(400).send(error.error.details[0].message);
        return
    }

    // validate system
    if (!req.requestingUser) return res.status(400).send("Please login first")
    if (!req.requestingUser.isBusiness) return res.status(400).send("You are not a business")

    // process: create card and add default image if not provided
    card = await new Card(
        { ...req.body, user_id: req.requestingUser._id, image: req.body.image ?? defaultImageObject }
    ).save()

    // response
    res.send({ card: card, creatingUser: _.pick(req.requestingUser, ["name", "email", "isBusiness", "createdAt", "_id"]) })
})

module.exports = router