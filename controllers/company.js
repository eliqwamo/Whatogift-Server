import express from "express";
const router = express.Router();

//Update account
router.post('/create_company', async(req,res) => {

    //Check if company exist under the associate id!!!!!!
})

router.post('/update_company', async(req,res) => {


})




router.get('/greeting', async(request, response) => {
    return response.status(200).json({
        messgae: 'Hello from Whatogift App'
    });
})

export default router;