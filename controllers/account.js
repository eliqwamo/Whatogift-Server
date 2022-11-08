import express from "express";
const router = express.Router();
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

//MODELS
import Account from '../models/account.js';

router.post('/signup', async(req,res) => {
    const id = mongoose.Types.ObjectId();
    const {firstName, lastName, email, password} = req.body;
    //Check if user exist
    Account.findOne({email:email})
    .then(async account => {
        if(account){
            return res.status(200).json({
                status: false,
                message: 'Account not available'
            });
        } else {
            const hash = await bcryptjs.hash(password, 10);
            const code = generateRandomIntegerInRange(1111,9999);
            const _account = new Account({
                _id: id,
                email: email,
                password: hash,
                firstName: firstName,
                lastName: lastName,
                passcode: code
            })
            _account.save()
            .then(account_created => {
                return res.status(200).json({
                    status: true,
                    message: account_created
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
    .catch(error => {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    })
    //Store user in db
    //Send verivication code
})
router.post('/verify', async(req,res) => {
    //Get code + email
    const {email, code} = req.body;
    //Check if code match
    Account.findOne({email:email})
    .then(async account => {
        if(parseInt(code) == parseInt(account.passcode)){

            account.isVerified = true;
            account.save()
            .then(account_updated => {
                return res.status(200).json({
                    status: true,
                    message: account_updated
                });
            })
            .catch(error => {
                return res.status(500).json({
                    status: false,
                    message: error.message
                });
            })
        } else {
            return res.status(200).json({
                status: false,
                message: 'Verify code not match'
            });
        }
    })
    .catch(error => {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    })
    //Update db false true
})
router.post('/login', async(req,res) => {
    //Get user login data
    const {email,password} = req.body;
    //Check if user exist and password match
    Account.findOne({email:email})
    .then(async account => {
        const isMatch = await bcryptjs.compare(password, account.password);
        if(isMatch && account.isVerified){

            const data = {account};
            const token = await jwt.sign(data, 'zt43dFwBWT85abZwIGhNRaUlLs9zsQaH');

            return res.status(200).json({
                status: true,
                message: account,
                token: token
            });
        } else {
            return res.status(200).json({
                status: false,
                message: 'Username or password not match or account not verified'
            });
        }
    })
    .catch(error => {
        return res.status(500).json({
            status: false,
            message: error.message
        });
    })
    //Generate JWT token
    //Response
})
router.get('/getOverview', async(req,res) => {

})


function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export default router;