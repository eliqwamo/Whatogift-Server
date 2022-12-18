import express from "express";
const router = express.Router();
import mongoose from 'mongoose';
import Auth from './auth.js';
import Category from '../models/category.js';
import Brand from '../models/brand.js';
import Product from '../models/product.js';


/**
 * @swagger
 * /api/product/get_all_brands:
 *  get:
 *   summary: Get list of all brands
 *   description: Endpoint to get list of all brands
 *   tags: [Products]
 *   responses:
 *    200:
 *     description: OK successfull
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *    500:
 *     description: Something is not working well
 */
router.get('/get_all_brands', async(req,res) => {
    Brand.find()
    .then(brands => {
        return res.status(200).json({
            message: brands
        })
    })
    .catch(error => { return res.status(500).json({message: error.message})})
})

/**
 * @swagger
 * /api/product/get_brand_by_id/{id}:
 *  get:
 *   summary: Get brand name by id
 *   tags: [Products]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    200:
 *     description: Brand success
 *    500:
 *     description: Something is not working well 
 */
router.get('/get_brand_by_id/:id', async(req,res) => {
    Brand.findById(req.params.id)
    .then(brand => {
        return res.status(200).json({
            message: brand
        })
    })
    .catch(error => { return res.status(500).json({message: error.message})})
})


/**
 * @swagger
 * definitions:
 *  Brand:
 *   type: object
 *   properties:
 *    brandName:
 *     type: string
 *     description: The name of the brand
 *     example: Nike
 *    brandLogo:
 *     type: string
 *     description: Copy and paste image url
 *     example: nike_logo.png
 */

/**
 * @swagger
 * /api/product/create_new_brand:
 *  post:
 *   summary: Create new brand
 *   description: Use this endpoint to create a new brand
 *   tags: [Products]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Brand'
 *   responses:
 *    200:
 *     description: Brand created
 *    500:
 *     description: Failure in created brand
 */
router.post('/create_new_brand', async(req,res) => {
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

/**
 * @swagger
 * /api/product/get_all_categories:
 *  get:
 *   summary: Get list of all categories
 *   description: Endpoint to get list of all categories
 *   tags: [Products]
 *   responses:
 *    200:
 *     description: OK successfull
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *    500:
 *     description: Something is not working well
 */
router.get('/get_all_categories', async(req,res) => {
    Category.find()
    .then(categories => {
        return res.status(200).json({
            message: categories
        })
    })
    .catch(error => { return res.status(500).json({message: error.message})})
})


router.post('/create_new_category', async(req,res) => {
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


/**
 * @swagger
 * /api/product/get_all_products:
 *  get:
 *   summary: Get list of all products
 *   description: Endpoint to get list of all products
 *   tags: [Products]
 *   responses:
 *    200:
 *     description: OK successfull
 *     content:
 *      application/json:
 *       schema:
 *        type: array
 *    500:
 *     description: Something is not working well
 */
router.get('/get_all_products', Auth, async(req,res) => {

    console.log(req.body);

    Product.find()
    .then(products => {
        return res.status(200).json({
            status: true,
            message: products
        })
    })
    .catch(error => { return res.status(500).json({status: false, message: error.message})})
})


router.post('/create_new_product', async(req,res) => {
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