const router = require('express').Router();
const async = require('async');

const Category = require('../models/category');
const Product = require('../models/product');

router.route('/categories')
  .get((req, res, next) => {
    Category.find({}, (err, categories) => {
      res.json({
        success: true,
        message: 'Success',
        categories: categories
      });
    });
  })
  .post((req, res, next) => {
    let category = new Category();
    category.name = req.body.category;
    category.save();
    res.json({
      success: true,
      message: 'Successful'
    });
  });

  router.get('/categories/:id', (req, res, next) => {
    const perPage= 10;
    const page = req.query.page
    async.waterfall([
      function(callback) {
        Product.count({ category: req.params.id }, (err, count) => {
          let totalProducts = count;
          callback(err, totalProducts);
        });
      },
      function(totalProducts, callback) {
        Product.find({ category: req.params.id })
          .skip(perPage * page)
          .limit(perPage)
          .populate('category')
          .populate('owner')
          .exec((err, products) => {
            if (err) return next(err);
            callback(err, products, totalProducts);
          });
      },
      function(products, totalProducts, callback) {
        Category.findOne({ _id: req.params.id }, (err, category) => {
          res.json({
            success: true,
            message: 'category',
            products: products,
            categoryName: category.name,
            totalProducts: totalProducts,
            pages: Math.ceil(totalProducts / perPage)
          });
        });
      }
    ]);

  });

  module.exports = router;