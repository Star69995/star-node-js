const mongoose = require("mongoose")
const _ = require("lodash")

const userSchema = new mongoose.Schema({
    name: {
        first: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 255
        },
        middle: {
            type: String,
            required: false,
            maxlength: 255,
            default: ""
        },
        last: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 255
        }
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 255,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 10
    },
    password: {
        type: String,
        required: true
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
    isBusiness: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const User = mongoose.model("User", userSchema, "users")

const Joi = require("joi")

const validation = {
    name: Joi.object({
        first: Joi.string().min(2).max(255).required(),
        middle: Joi.string().max(255).optional(),
        last: Joi.string().min(2).max(255).required(),
    }).required(),
    phone: Joi.string()
        .pattern(/^[0-9]{9,10}$/)
        .required(),
    email: Joi.string().min(6).max(255).required().email(),
    address: Joi.object({
        state: Joi.string().min(2).max(255),
        country: Joi.string().min(2).max(255).required(),
        city: Joi.string().min(2).max(255).required(),
        street: Joi.string().min(2).max(255).required(),
        houseNumber: Joi.string().min(1).max(255).required(),
        zip: Joi.string().min(2).max(255)
    }).required(),
    image: Joi.object({
        url: Joi.string().uri().max(1024),
        alt: Joi.string().max(255)
    }),    
    password: Joi.string().min(6).max(255).required(),
    isBusiness: Joi.boolean()
}
const userValidation = Joi.object(validation).required()

const authValidation = Joi.object(_.pick(validation, ["email", "password"])).required()

module.exports = { User, userValidation, authValidation }