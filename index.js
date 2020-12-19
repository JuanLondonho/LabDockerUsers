//Load express module with `require` directive
var express = require('express')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.urlencoded({ extended: false }))
app.use(bodyParser.json())

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const mongoose = require('mongoose');
const User = require('./user');

const port = process.env.PORT || 8081;
const db_link = "mongodb://mongo:27017/usersdb";
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(db_link, options).then( function() {
    console.log('MongoDB is connected');
}).catch( function(err) {
    console.log(err);
});


//Define request response in root URL (/)
app.get('/', function (req, res) {
    res.send('Hello Mobile Users!')
})

//Launch listening server on port 8081
app.listen(8081, function () {
    console.log('app listening on port 8081!')
})

// Extended: https://swagger.io/specification/#infoObject
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "mobile-users API",
            description: "crud of mobile-users",
            contact: {
                name: "juanlondonho"
            },
            servers: ["http://localhost:8081"]
        }
    },
    apis: ["index.js"]
};
const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


// ----------------------------------------------------------------------------

/**
* @swagger
* /users:
*   get:
*      description: Use to request all users
*      responses:
*        '200':
*           description: A successful response
*        '500':
*           description: Internal Error
*/
app.get('/users', function (req, res) {
    User.find(function (err, users) {
        if(err){
            return res.status(500);
        }else{
            return res.status(200).json(users)
        }
    })
})



/**
* @swagger
* /users/{id}:
*   put:
*       description: Use to update a user
*       parameters:
*           - name: id
*             in: path
*             description: id for update user
*             required: true
*           - name: user
*             in: body
*             type: object
*             required: true
*       responses:
*           '201':
*               description: A successful response
*           '500':
*               description: Internal Error
*/
app.put('/users/:id', async function (req, res) {
    var userId = req.params.id;
    try{
        var userUpdate = req.body;
        var user = await User.findByIdAndUpdate(userId, userUpdate);
        return res.status(201).json(user);
    }catch{
        return res.status(500)
    }
})

/**
 * @swagger
 * /users:
 *  post:
 *      description: Creates a new user
 *      parameters:
 *          - name: user
 *            description: user object
 *            in: body
 *            type: object
 *            required: true
 *      responses:
 *          '201':
 *              description: Successfully created
 *          '500':
 *              description: Internal Error
 */
//{"name": "Juan", "nit": "123", "email":"juan@gmail.com", "country":"Colombia", "phoneNumber":"321"}
app.post('/users', function (req, res) {
    var newUser = req.body;
    try {
        let user = new User(newUser);
        user.save();
        return res.status(201).json(user);
    }
    catch (err) {
        return res.status(500)
    }
});


/**
* @swagger    
* /users/{id}:
*  delete:
*    description: Deletes a single user
*    parameters:
*      - name: id
*        in: path
*        description: user id
*        required: true
*    responses:
*      '200':
*        description: Successfully deleted
*      '500':
*        description: Internal Error
*        content:
*          type: object
*/
app.delete('/users/:id',async function (req, res) {
    let userId = req.params.id;
    try{
        var user = await User.findByIdAndRemove(userId);
        return res.status(200).json(user)
    }
    catch (err) {
        return res.status(500)
    }
})