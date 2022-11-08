import express from "express";
const router = express.Router();

router.get('/greeting', async(request, response) => {
    return response.status(200).json({
        messgae: 'Hello from Whatogift App'
    });
})

export default router;