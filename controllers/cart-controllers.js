const User = require('../models/user');
const Product = require('../models/product');

exports.getCart = (req, res, next) => {
    userId = req.userId;

    User.findById(userId)
        .then(userdetails => {
            return userdetails.cart
        })
        .then(cart => {
            return res.json({
                message: "successfully got the cart",
                cart: cart
            })
        })
        .catch(err => {
            next(new Error(err));
        })
}

exports.addToCart = (req, res, next) => {
    const loggedInUserId = req.userId;
    const productId = req.params.productId;
    let user;
    let productpopulated; //later, to retrieve price of the product we adding to the cart
    Product.findById(productId)
        .then(foundProduct => {
            productpopulated = foundProduct;
            return User.findById(loggedInUserId)
        })
        .then(foundUser => {
            user = foundUser
            return foundUser.cart
        })
        .then(foundCart => {
            const foundIndex = foundCart.items.findIndex(cp => {
                return cp.product.toString() === productId.toString();
            })

            if (foundIndex < 0) {
                foundCart.items.unshift({
                    product: productId,
                    quantity: 1
                });
                foundCart.amount += productpopulated.price;
                return user.save();
            } else {
                res.redirect("/cart");
            }
        })
        .then(result => {
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err)
            next(new Error(err));
        })
}

exports.clearCart = (req, res) => {
    const loggedInUserId = req.userId;

    User.findById(loggedInUserId)
        .then(loggedInUser => {
            loggedInUser.cart.items = []
            loggedInUser.cart.amount = 0

            return loggedInUser.save()
        })
        .then(savedUser => {
            return res.json({
                cart: savedUser.cart
            })
        })
        .catch(err => {
            next(new Error(err));
        })
}

exports.incrementItem = (req, res, next) => {
    const loggedInUserId = req.userId;
    const productId = req.params.productId;
    let productpopulated;
    let user;

    Product.findById(productId)
        .then(foundProduct => {
            productpopulated = foundProduct;
            return User.findById(loggedInUserId);
        })
        .then(loggedInUser => {
            user = loggedInUser;
            return loggedInUser.cart;
        })
        .then(foundCart => {
            const found = foundCart.items.find(cp => {
                return cp.product.toString() === productId.toString();
            })

            if (found) {
                found.quantity++;
                foundCart.amount += productpopulated.price;

                return user.save();
            }
        })
        .then(result => {
            res.redirect("/cart");
        })
        .catch(err => {
            next(new Error(err));
        })
}

exports.decrementItem = (req, res, next) => {
    const loggedInUserId = req.userId;
    const productId = req.params.productId;
    let productpopulated;
    let user;

    Product.findById(productId)
        .then(foundProduct => {
            productpopulated = foundProduct;
            return User.findById(loggedInUserId);
        })
        .then(loggedInUser => {
            user = loggedInUser;
            return loggedInUser.cart;
        })
        .then(foundCart => {
            const found = foundCart.items.find(cp => {
                return cp.product.toString() === productId.toString();
            })

            if (found && found.quantity > 1) {
                found.quantity--;
                foundCart.amount -= productpopulated.price;

                return user.save();
            }
        })
        .then(result => {
            res.redirect("/cart");
        })
        .catch(err => {
            next(new Error(err));
        })
}

exports.removeItem = (req, res, next) => {
    const productId = req.params.productId;
    const loggedInUserId = req.userId;
    let loggedInUser;
    let productpopulated;

    User.findById(loggedInUserId)
        .then(foundUser => {
            loggedInUser = foundUser
            return Product.findById(productId)
        })
        .then(foundProduct => {
            productpopulated = foundProduct;
            return loggedInUser.cart;
        })
        .then(foundCart => {
            const foundIndex = foundCart.items.findIndex(cp => {
                return cp.product.toString() === productId.toString();
            })

            if (foundIndex >= 0) {
                foundCart.amount -= (productpopulated.price * foundCart.items[foundIndex].quantity);

                foundCart.items.splice(foundIndex, 1);
                return loggedInUser.save();
            }
        })
        .then(result => {
            res.redirect("/cart");
        })
        .catch(err => {
            console.log(err)
            next(new Error(err));
        })
}