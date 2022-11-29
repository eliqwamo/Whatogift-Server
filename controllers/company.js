import express from "express";
const router = express.Router();
import Auth from './auth.js';
import Company from '../models/company.js';
import mongoose from 'mongoose';


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