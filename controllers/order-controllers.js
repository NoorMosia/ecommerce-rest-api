const User = require('../models/user')
const Order = require('../models/orders')

exports.getAllOrders = (req, res, next) => {
    Order.find()
        .then(allOrders => {
            res.json({
                orders: allOrders
            })
        })
}


exports.getAnOrders = (req, res, next) => {

}

exports.addOrder = (req, res, next) => {
    const userId = req.userId;
    let loggedInUser;
    let newOrder = new Order;

    User.findById(userId)
        .then(foundUser => {
            loggedInUser = foundUser;
            return foundUser.cart;
        })
        .then(foundCart => {
            newOrder.userId = userId;
            newOrder.amount = foundCart.amount;

            return foundCart.items.populate('product').execPopulate();;
        })
        .then(items => {
            console.log(items)
            items.forEach(product => {
                newOrder.products.push({
                    name: product.productId.name,
                    price: product.productId.price,
                    creator: product.productId.user,
                    quantity: product.quantity
                })
            })

            foundUser.cart.items = [];
            foundUser.cart.amount = 0;

            foundUser.save();
            return newOrder.save();
        })
        .then(saved => {
            res.redirect('/cart');

            return User.findById(user._id)
        })
        .then(user => {
            user.orders.push(newOrder);
            user.save();
        })
        .catch(err => {
            next(new Error(err));
        })
}


exports.getUserOrder = (req, res, next) => {
    loggedInUserId = req.userId;

    User.findById(loggedInUserId)
        .then(foundUser => {
            return Order.findById(foundUser.orders)
        })
        .then(foundOrders => {
            res.json({
                userOrders: foundOrders
            })
        })
        .catch(err => {
            next(new Error(err));
        })
}