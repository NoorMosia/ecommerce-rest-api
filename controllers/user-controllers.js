const User = require('../models/user');

exports.getAllUsers = (req, res) => {
    User.find()
        .then(users => {
            res.json({
                users: users
            })
        })
        .catch(error => {
            console.log(error)
        });
}

exports.getUserDetails = (req, res) => {
    const userId = req.params.userId;
    let user;

    User.findById(userId)
        .then(foundUser => {
            user = foundUser;
            return user.populate('products').execPopulate();
        })
        .then(populatedUser => {
            res.json({
                user: populatedUser,
            });
        })
        .catch(error => {
            console.log(error)
        });
}

exports.updateUser = (req, res) => {

}

exports.deleteUser = (req, res) => {

}