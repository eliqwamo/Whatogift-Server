import express from "express";
import bp from 'body-parser';
import mongoose from "mongoose";

const app = express();

app.use(bp.urlencoded({extended:false}));
app.use(bp.json());

const mongoUrl = 'mongodb+srv://whatogift-user:JkqjBfxJpI3EdNcC@cluster0.evlpywq.mongodb.net/whatogiftdb?retryWrites=true&w=majority';


///////////////////////////////ROUTES/////////////////////////////////
import accountRoute from './controllers/account.js';
app.use('/api/account', accountRoute);
//---------------------END OF ROUTES -----------------------------////


const port = 3001;

mongoose.connect(mongoUrl)
.then(results => {
    console.log(results);
    app.listen(port, function(){
        console.log(`Server is running via port ${port}`);
    });
})
.catch(error => { console.log(error.message) })

