import express from "express";
const router = express.Router();
import mongoose from 'mongoose';
import Auth from './auth.js';
import Category from '../models/category.js';
import Brand from '../models/brand.js';
import Product from '../models/product.js';
import { getDistance } from 'geolib';
import Account from '../models/account.js';

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




router.post('/storeProductToFav', Auth, async(req,res) => {

    const account = await Account.findById(req.user._id);
    const productId = req.body.productId;
    let favs = account.myfavs;

    if (productId) {
        const isExist = favs.filter(x => x.productId == productId);
        if(isExist == 0){
            const new_fav = {productId: productId};
            favs.push(new_fav);
            account.myfavs = favs;
            account.save()
            .then(product_store => {
                return res.status(200).json({
                    status: true,
                    message: product_store
                })
            })
            .catch(error => {
                return res.status(500).json({
                    status: false,
                    message: error.message
                })
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Product exist'
            })
        }
    } else {
        return res.status(500).json({
            status: false,
            message: 'Product id not found'
        })
    }


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
 *  Product:
 *   type: object
 *   properties:
 *    companyId:
 *     type: string
 *     example: string
 *    categoryId:
 *     type: string
 *     example: string
 *    brandId:
 *     type: string
 *     example: string
 *    productName:
 *     type: string
 *     example: Product name
 *    productImage:
 *     type: string
 *     example: image url
 *    productPrice:
 *     type: number
 *     example: 119.90
 *    productDescription:
 *     type: string
 *     example: The product description
 *    unitInStock:
 *     type: number
 *     example: 100
 *    eventsTag:
 *     type: array
 *     example: [{name: 'birthday'}]
 *    interestTags:
 *     type: array
 *     example: [{name: 'music'}]
 *    ageTags:
 *     type: array
 *     example: [{name: 0-10}]
 *    genderTag:
 *     type: string
 *     example: female
 *  Category:
 *   type: object
 *   properties:
 *    categoryName:
 *     type: string
 *     description: The category name
 *     example: Gadgets
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




/**
 * @swagger
 * /api/product/create_new_category:
 *  post:
 *   summary: Create new category
 *   description: Use this endpoint to create a new category
 *   tags: [Products]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Category'
 *   responses:
 *    200:
 *     description: Category created
 *    500:
 *     description: Failure in created category
 */
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


router.put('/update_category/:id', Auth, async(req,res) => {
    const categoryName = req.body.categoryName;
    const categoryId = req.params.id;
    Category.findById(categoryId)
    .then(category => {
        category.categoryName = categoryName;
        category.save()
        .then(category_updated => {
            return res.status(200).json({
                status: true,
                message: category_updated
            })
        })
    })
    .catch(error => {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    })
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
router.post('/get_all_products', Auth, async(req,res) => {

    console.log(req.body.latitude);
    console.log(req.body.longitude);

    Product.find()
    .populate('companyId')
    .populate('categoryId')
    .populate('brandId')
    .then(products => {

        let allGifts = [];
        products.forEach(gift => {

            const distance = getDistance(
                { latitude: req.body.latitude, longitude: req.body.longitude },
                { 
                    latitude: gift.companyId.contact.latitude, 
                    longitude: gift.companyId.contact.longitude 
                }
            );
            const giftItem = {
                gift: gift,
                distance: distance
            }

            allGifts.push(giftItem);

        });



        return res.status(200).json({
            status: true,
            message: allGifts
        })





    })
    .catch(error => { return res.status(500).json({status: false, message: error.message})})



})

/**
 * @swagger
 * /api/product/create_new_product:
 *  post:
 *   summary: Create new product
 *   description: Use this endpoint to create a new product
 *   tags: [Products]
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Product'
 *   responses:
 *    200:
 *     description: Product created
 *    500:
 *     description: Failure in created product
 */
router.post('/create_new_product', async(req,res) => {
    const id = mongoose.Types.ObjectId();
    const {
        companyId,categoryId,brandId,
        productName,productPrice,productDescription,
        unitInStock, productImage,eventsTag,interestTags,
        ageTags, genderTag
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
        reviews: [],
        eventsTag: eventsTag,
        interestTags: interestTags,
        ageTags: ageTags,
        genderTag: genderTag
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



/**
 * @swagger
 * /api/product/delete_category/{id}:
 *  delete:
 *   summary: Remove category by id
 *   tags: [Products]
 *   parameters:
 *    - in: path
 *      name: id
 *      schema:
 *       type: string
 *      required: true
 *   responses:
 *    200:
 *     description: Success
 *    500:
 *     description: Something is not working well 
 */
router.delete('/delete_category/:id', Auth, async(req,res) => {
    const categoryId = req.params.id;
    Category.findByIdAndDelete(categoryId)
    .then(deleted => {
        return res.status(200).json({
            status: true,
            message: 'Category removed'
        })
    })
    .catch(error => {
        return res.status(500).json({
            status: false,
            message: error.message
        })
    })
})




router.delete('/delete_product', Auth, async(req,res) => {})



export default router;