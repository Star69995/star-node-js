const _ = require("lodash")
const mongoose = require("mongoose")

const cardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    subtitle: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 255
    },
    description:
    {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 1024
    },
    address: {
        state: {
            type: String,
            required: false,
            minlength: 2,
            maxlength: 255,
            default: "not defined"
        },
        country: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 255
        },
        city: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 255
        },
        street: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 255
        },
        houseNumber: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 255
        },
        zip: {
            type: String,
            required: false,
            minlength: 2,
            maxlength: 255,
            default: "not defined"
        }
    },
    web: {
        type: String,
        required: false,
        minlength: 2,
        maxlength: 255,
        default: "not defined"
    },
    email:
    {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255
    },
    phone: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 10
    },
    image: {
        url: {
            type: String,
            required: false,
            maxlength: 1024,
            default: ""
        },
        alt: {
            type: String,
            required: false,
            maxlength: 255,
            default: ""
        }
    },
    bizNumber: {
        type: Number,
        required: true,
        min: 100,
        max: 9_999_999_999,
        unique: true
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: {
        type: [mongoose.Schema.Types.ObjectId], // מערך של ObjectId
        ref: "User", // מצביע למודל "User"
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

cardSchema.pre("validate", async function (next) {
    const generateUniqueBizNumber = async () => {
        const number = _.random(100, 9_999_999_999);
        const exists = await this.constructor.exists({ bizNumber: number });
        return exists ? generateUniqueBizNumber() : number;
    };
    this.bizNumber = await generateUniqueBizNumber();
    next();
});


const Card = mongoose.model("Card", cardSchema, "cards")

const Joi = require("joi")

const cardValidation = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    subtitle: Joi.string().min(2).max(255).required(),
    description: Joi.string().min(2).max(1024).required(),
    address: Joi.object({
        state: Joi.string().max(255),
        country: Joi.string().min(2).max(255).required(),
        city: Joi.string().min(2).max(255).required(),
        street: Joi.string().min(2).max(255).required(),
        houseNumber: Joi.string().min(1).max(255).required(),
        zip: Joi.string().max(255)
    }).required(),
    web: Joi.string().uri().min(2).max(255),
    email: Joi.string().min(6).max(255).required().email(),
    phone: Joi.string()
        .pattern(/^[0-9]{9,10}$/)
        .required(),
    image: Joi.object({
        url: Joi.string().uri().max(1024),
        alt: Joi.string().max(255)
    }),
    likes: Joi.array().items(Joi.string().length(24).hex())
}).required()

module.exports = { Card, cardValidation }