const Product = require('../models/product');
const User = require('../models/user');

ItemsPerPage = 3;

exports.getAllProducts = (req, res, next) => {
    let currentPage = +req.query.page || 1;
    let totalItems;

    //find products and render the template
    Product.countDocuments()
        .then(numberOfDocs => {
            totalItems = numberOfDocs;
            return Product.find()
                .skip((currentPage - 1) * ItemsPerPage)
                .limit(ItemsPerPage)
        })
        .then(result => {
            return res.json({
                products: result,
                currentPage: currentPage,
                ItemsPerPage: ItemsPerPage,
                hasNextPage: currentPage * ItemsPerPage < totalItems,
                hasPreviousPage: currentPage > 1,
                nextPage: currentPage + 1,
                previousPage: currentPage - 1,
                lastPage: Math.ceil(totalItems / ItemsPerPage)
            });
        })
        .catch(err => {
            next(new Error(err));
        });
}

exports.getProductDetails = (req, res, next) => {
    const productId = req.params.productId;
    let newProduct;

    Product.findById(productId)
        .then(product => {
            newProduct = product;
            res.json({
                product: newProduct,
            });
        })
        .catch(err => {
            next(new Error(err));
        });
}

exports.updateProduct = (req, res, next) => {
    const productId = req.params.productId;
    const name = req.body.name;
    const price = req.body.price;
    const details = req.body.details;

    Product.findById(productId)
        .then(product => {
            return product;
        })
        .then(product => {
            product.name = name || product.name;
            product.price = price || product.price;
            product.details = details || product.details;
            product.user = product.user;
            return product.save();
        })
        .then(result => {
            res.json({
                updatedProduct: result
            })
        })
        .catch(err => {
            next(new Error(err));
        });
}

exports.deleteProduct = (req, res, next) => {
    const productId = req.params.productId;
    let productFilled;

    Product.findById(productId)
        .then(foundProduct => {
            return Product.findByIdAndDelete(productId);
        })
        .then(result => {
            res.redirect("/")
        })
        .catch(err => {
            next(new Error(err));
        })
}

exports.createProduct = (req, res, next) => {
    const name = req.body.name;
    const price = req.body.price;
    const details = req.body.details;
    let newProduct;
    const userId = req.userId;

    newProduct = new Product({
        name: name,
        price: price,
        details: details,
        user: userId
    });
    newProduct.save();

    User.findById(userId)
        .then(user => {
            return user.products.push(newProduct);
        })
        .then(result => {
            res.status(201).json({
                message: 'Post created successfully!',
                post: newProduct,
            });
        })
        .catch(err => {
            next(new Error(err));
        })
}