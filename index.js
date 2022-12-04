import express from "express";
import bp from 'body-parser';
import mongoose from "mongoose";

import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";

const app = express();

app.use(bp.urlencoded({extended:false}));
app.use(bp.json());

const mongoUrl = 'mongodb+srv://whatogift-user:JkqjBfxJpI3EdNcC@cluster0.evlpywq.mongodb.net/whatogiftdb?retryWrites=true&w=majority';


const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Whatogift API Endpoints',
            version: '1.0.0'
        },
        servers: [
            {
                url: 'http://localhost:3001'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis:['./controllers/*.js']
}

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec));

///////////////////////////////ROUTES/////////////////////////////////
import accountRoute from './controllers/account.js';
app.use('/api/account', accountRoute);

import companiesRoute from './controllers/company.js';
app.use('/api/company', companiesRoute);

import productRoute from './controllers/product.js';
app.use('/api/product', productRoute);
//---------------------END OF ROUTES -----------------------------////


const port = 3001;

mongoose.connect(mongoUrl)
.then(results => {
    app.listen(port, function(){
        console.log(`Server is running via port ${port}`);
    });
})
.catch(error => { console.log(error.message) })

