import jwt from 'jsonwebtoken';
import Account from '../models/account.js';

export default (req,res,next) => {

    const header = req.headers['authorization'];
    if(header){
        const bearer = header.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken,'zt43dFwBWT85abZwIGhNRaUlLs9zsQaH', (error,authdata) => {
            if(error){
                return res.sendStatus(403);
            } else {
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