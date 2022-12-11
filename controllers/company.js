import express from "express";
const router = express.Router();
import Auth from './auth.js';
import Company from '../models/company.js';
import mongoose from 'mongoose';
import { getDistance } from 'geolib';

/**
 * @swagger
 * definitions:
 *  FindmyStores:
 *   properties:
 *    latitude:
 *     type: number
 *     example: 31.2573952
 *    longtitude:
 *     type: number
 *     example: 34.7897856
 */


/**
 * @swagger
 * /api/company/get_companies_by_location:
 *  post:
 *   summary: Get user distance by location
 *   tags: [Company]
 *   description: Get all companies by user location
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/FindmyStores'
 *   responses: 
 *    200:
 *     description: Success
 *    500:
 *     description: Error
 */
router.post('/get_companies_by_location', Auth, async(req,res) => {
    const {latitude,longtitude} = req.body;


    console.log(latitude);
    console.log(longtitude);

    
    Company.find()
    .then(companies => {


        let formattedCompanies = [];


        companies.forEach(company => {
            const distance = getDistance(
                { latitude: latitude, longitude: longtitude },
                { latitude: company.contact.latitude, longitude: company.contact.longitude }
            );
            const _company = {
                companyItem: company,
                distanceItem: distance 
            }
            formattedCompanies.push(_company);
        })
        return res.status(200).json({
            status: true,
            message: formattedCompanies
        })
    })
    .catch(error => {
        return res.status(500).json({
            message: error.message
        })
    })
})


/**
 * @swagger
 * /api/company/get_companies:
 *  get:
 *   summary: Get list of all companies
 *   tags: [Company]
 *   responses:
 *    200:
 *     description: Success
 *    500:
 *     description: Error
 */
router.get('/get_companies', Auth, async(req,res) => {
    Company.find()
    .then(companies => {
        return res.status(200).json({
            message: companies
        })
    })
    .catch(error => {
        return res.status(500).json({
            message: error.message
        })
    })
})

//Update account
router.post('/create_company', Auth, async(req,res) => {
    const user = req.user;
    const company = await Company.find({associateId: user._id});
    if(company.length > 0){
        return res.status(200).json({
            status: false,
            message: 'Company exist'
        });
    } else {
        const id = mongoose.Types.ObjectId();
        const {companyName,contact} = req.body;
        const _company = new Company({
            _id: id,
            associateId: user._id,
            companyName: companyName,
            contact: contact,
            bio: ''
        });
        _company.save()
        .then(company_created => {
            return res.status(200).json({
                status: true,
                message: company_created
            });
        })
        .catch(error => {
            return res.status(500).json({
                status: false,
                message: error.message
            });
        })
    }
})

router.post('/update_company', Auth, async(req,res) => {

})




router.get('/greeting', async(request, response) => {
    return response.status(200).json({
        messgae: 'Hello from Whatogift App'
    });
})

export default router;