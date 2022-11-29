import express from "express";
const router = express.Router();
import mongoose from 'mongoose';
import Auth from './auth.js';
import Category from '../models/category.js';
import Brand from '../models/brand.js';
import Product from '../models/product.js';

router.get('/get_all_brands', Auth, async(req,res) => {
    Brand.find()
    .then(brands => {
        return res.status(200).json({
            message: brands
        })
    })
    .catch(error => { return res.status(500).json({message: error.message})})
})
router.post('/create_new_brand', Auth, async(req,res) => {
    const {brandName,brandLogo} = req.body;
    const id = mongoose.Types.ObjectId();
    const _brand = new Brand({
        _id:id,
        brandName:brandName,
        brandLogo: brandLogo
    });
    _brand.save()
    .then(brand_created => {
        return res.status(200).json({message:brand_created})
    })
    .catch(error => {return res.status(500).json({message: error.message})})
})
router.get('/get_all_categories', Auth, async(req,res) => {
    Category.find()
    .then(categories => {
        return res.status(200).json({
            message: categories
        })
    })
    .catch(error => { return res.status(500).json({message: error.message})})
})
router.post('/create_new_category', Auth, async(req,res) => {
    const categoryName = req.body.categoryName;
    const id = mongoose.Types.ObjectId();
    const _category = new Category({
        _id:id,
        categoryName: categoryName
    });
    _category.save()
    .then(category_created => {
        return res.status(200).json({message:category_created})
    })
    .catch(error => {return res.status(500).json({message: error.message})})
})
router.get('/get_all_products', Auth, async(req,res) => {
    Product.find()
    .then(products => {
        return res.status(200).json({
            message: products
        })
    })
    .catch(error => { return res.status(500).json({message: error.message})})
})
router.post('/create_new_product', Auth, async(req,res) => {
    const id = mongoose.Types.ObjectId();
    const {
        companyId,categoryId,brandId,
        productName,productPrice,productDescription,
        unitInStock, productImage
    } = req.body;
    const _product = new Product({
        _id: id,
        companyId: companyId,
        categoryId: categoryId,
        brandId: brandId,
        productName: productName,
        productImage: [{imageSource: productImage}],
        productPrice: productPrice,
        productDescription: productDescription,
        unitInStock: unitInStock,
        reviews: []
    });
    _product.save()
    .then(product_created => {
        return res.status(200).json({
            message: product_created
        })
    })
    .catch(error => {
        return res.status(500).json({
            message: error.message
        })
    })
})






router.delete('/delete_brand', Auth, async(req,res) => {})
router.delete('/delete_category', Auth, async(req,res) => {})
router.delete('/delete_product', Auth, async(req,res) => {})



export default router;