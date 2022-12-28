import jwt from 'jsonwebtoken';
import Account from '../models/account.js';

export default (req,res,next) => {
    const header = req.headers['authorization'];
    console.log('header:' + header);
    if(header){
        const bearer = header.split(' ');
        const bearerToken = bearer[1];
        console.log('bearerToken:' + bearerToken);
        jwt.verify(bearerToken,'zt43dFwBWT85abZwIGhNRaUlLs9zsQaH', (error,authdata) => {
            if(error){
                console.log('error in the validation')
                return res.sendStatus(403);
            } else {
                console.log(JSON.stringify(authdata));
                Account.findById(authdata.account._id)
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