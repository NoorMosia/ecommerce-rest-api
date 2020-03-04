const {
    validationResult
} = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const Cart = require('../models/cart');
const Mailer = require('../models/mailer')

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const name = req.body.name;
    const email = req.body.email;
    const surname = req.body.surname;
    const imageUrl = req.body.imageUrl;
    const password = req.body.password;

    const cart = new Cart;
    bcrypt
        .hash(password, 12)
        .then(hashedPw => {
            const user = new User({
                email: email,
                password: hashedPw,
                name: name,
                surname: surname,
                imageUrl: imageUrl,
                cart: cart
            })

            cart.save()
            return user.save();
        })
        .then(savedUser => {

            res.status(201).json({
                message: 'User created!',
                userId: savedUser._id
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({
            email: email
        })
        .then(user => {
            if (!user) {
                const error = new Error('A user with this email could not be found.');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign({
                    email: loadedUser.email,
                    userId: loadedUser._id.toString()
                },
                'somesupersecretsecret', {
                    expiresIn: '12h'
                }
            );
            res.status(200).json({
                token: token,
                userId: loadedUser._id.toString()
            });
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err);
        });
};