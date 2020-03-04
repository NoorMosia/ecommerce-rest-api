const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const {
    check
} = require('express-validator');

const User = require('../models/user');
const AuthController = require('../controllers/auth-contollers');

router.post('/signup', [
    check('name')
    .isAlphanumeric()
    .withMessage('name must be alphanumeric'),
    check('surname')
    .isAlphanumeric()
    .withMessage('surname must be alphanumeric'),
    check('email')
    .isEmail()
    .withMessage('invalid email')
    .normalizeEmail()
    .trim()
    .custom((value, {
        req
    }) => {
        return User.findOne({
                email: value
            })
            .then(foundUser => {
                if (foundUser) { //if it already exists
                    return Promise.reject('E-Mail exists already, please pick a different one.');
                }
            });
    }),
    check('confirm-password')
    .trim()
    .custom((value, {
        req
    }) => {
        if (value !== req.body.password) {
            return Promise.reject('passwords do not match');
        }
        return true;
    })
], AuthController.signup);

router.post('/login', [
    check('email')
    .trim()
    .normalizeEmail()
    .custom((value, {
        req
    }) => {
        return User.findOne({
                email: value
            })
            .then(foundUser => {
                if (!foundUser) { //if it already exists
                    return Promise.reject('E-Mail address is not signed up.');
                }
            });
    }),
    check('password')
    .custom((value, {
        req
    }) => {
        return User.findOne({
                email: req.body.email
            })
            .then(foundUser => {
                return bcrypt.compare(value, foundUser.password)
            })
            .then(correct => {
                if (!correct) {
                    return Promise.reject('Invalid Password');
                }
            })
    })
], AuthController.login);


module.exports = router;