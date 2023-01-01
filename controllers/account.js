import express from "express";
const router = express.Router();
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Auth from './auth.js';

//MODELS
import Account from '../models/account.js';

/**
 * @swagger
 * definitions:
 *  Login:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     example: eli@qwamo.com
 *    password:
 *     type: string
 *     example: 123456
 *  Register:
 *   type: object
 *   properties:
 *    firstName:
 *     type: string
 *     example: Eli
 *    lastName:
 *     type: string
 *     example: Chitrit
 *    email:
 *     type: string
 *     example: eli@qwamo.com
 *    password:
 *     type: string
 *     example: 123456
 *  Verify:
 *   type: object
 *   properties:
 *    email:
 *     type: string
 *     example: eli@qwamo.com
 *    code:
 *     type: int
 *     example: 123456 
 */


/**
 * @swagger
 * /api/account/signup:
 *  post:
 *   summary: Create new account
 *   tags: [Account]
 *   description: Use this endpoint to create new account
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Register'
 *   responses: 
 *    200:
 *     description: Success
 *    500:
 *     description: Error
 */
router.post('/signup', async (req, res) => {
    const id = mongoose.Types.ObjectId();
    const { firstName, lastName, email, password, uid } = req.body;
    //Check if user exist
    Account.findOne({ email: email })
        .then(async account => {
            if (account) {
                return res.status(200).json({
                    status: false,
                    message: 'Account not available'
                });
            } else {
                const hash = await bcryptjs.hash(password, 10);
                const code = generateRandomIntegerInRange(1111, 9999);
                const _account = new Account({
                    _id: id,
                    uid: uid,
                    associateId: id,
                    email: email,
                    password: hash,
                    firstName: firstName,
                    lastName: lastName,
                    passcode: code
                })
                _account.save()
                    .then(async account_created => {

                        const data = { account_created };
                        const token = await jwt.sign(data, 'zt43dFwBWT85abZwIGhNRaUlLs9zsQaH');

                        return res.status(200).json({
                            status: true,
                            message: account_created,
                            token: token
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

/**
 * @swagger
 * /api/account/verify:
 *  post:
 *   summary: Verify new account
 *   tags: [Account]
 *   description: Use this endpoint to verify new account
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Verify'
 *   responses: 
 *    200:
 *     description: Success
 *    500:
 *     description: Error
 */
router.post('/verify', async (req, res) => {
    //Get code + email
    const { email, code } = req.body;
    //Check if code match
    Account.findOne({ email: email })
        .then(async account => {
            if (parseInt(code) == parseInt(account.passcode)) {

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

/**
 * @swagger
 * /api/account/login:
 *  post:
 *   summary: Login
 *   tags: [Account]
 *   description: Use this endpoint to sign in
 *   requestBody:
 *    content:
 *     application/json:
 *      schema:
 *       $ref: '#/definitions/Login'
 *   responses: 
 *    200:
 *     description: Success
 *    500:
 *     description: Error
 */
router.post('/login', async (req, res) => {
    //Get user login data
    const { email, password } = req.body;
    console.log(email);
    //Check if user exist and password match
    Account.findOne({ email: email })
        .then(async account => {
            console.log(account);
            if (account) {
                const isMatch = await bcryptjs.compare(password, account.password);
                    const data = { account };
                    const token = await jwt.sign(data, 'zt43dFwBWT85abZwIGhNRaUlLs9zsQaH');

                    console.log(token);
                    return res.status(200).json({
                        status: true,
                        message: account,
                        token: token
                    });
            } else {
                return res.status(200).json({
                    status: false,
                    message: 'Account not exist'
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


//Update account
router.put('/update_account', async (req, res) => { })
//Update password
router.put('/update_password', async (req, res) => {
    //Get current password
    //Get new password
})

router.get('/getOverview', Auth, async (req, res) => {
    return res.status(200).json({
        message: `Hello ${req.user.firstName} ${req.user.lastName}`
    });
})


function generateRandomIntegerInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export default router;