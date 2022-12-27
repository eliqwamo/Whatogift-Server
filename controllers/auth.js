import jwt from 'jsonwebtoken';
import Account from '../models/account.js';

export default (req,res,next) => {
    console.log('enterd the auth')
    const header = req.headers['authorization'];
    console.log('got the headers')
    if(header){
        const bearer = header.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken,'zt43dFwBWT85abZwIGhNRaUlLs9zsQaH', (error,authdata) => {
            console.log('started validation')
            if(error){
                console.log('error in the validation')
                return res.sendStatus(403);
            } else {
                console.log('no error in the validation')
                Account.findById(authdata.account_created._id)
                .then(user => {
                    req.user = user;
                    next();
                })
                .catch(error => {
                    return res.status(500).json({
                        message: error.message
                    })
                })
            }
        });
    } else {
        return res.sendStatus(403);
    }
}