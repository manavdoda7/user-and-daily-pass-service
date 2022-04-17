const express = require('express')
const app = express()
require('./middlewares/dbconnection')
var cors = require("cors");
require('dotenv').config()
app.use(cors());
app.use(express.json());


const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

app.use(express.urlencoded({ extended: true }));


const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "User and Daily Pass API",
            version: "1.0.0",
        },
        servers: [
            {
                url: "https://user-and-daily-pass.herokuapp.com/",
            },
            {
                url: "http://localhost:5001",
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes/*.js"],
};
const swaggerSpecs = swaggerJsdoc(options);
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));


app.get('/', (req, res)=>{
    console.log('GET / request');
    res.status(200).json({success: true, message: 'Welcome to the backend.'})
})

app.use('/api/authenticate', require('./routes/authentication'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/dailypass', require('./routes/dailyPassRoute'))

app.listen(process.env.PORT||5001, ()=>{
    console.log(`App listening at port ${process.env.PORT||5001}`)
})