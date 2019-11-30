const express = require('express')
const bodyparser = require('body-parser')
const cors = require('cors')
require('express-group-routes')
const app = express()
app.use(cors())
app.use(bodyparser.json())


app.get('/',(req,res)=> {
    res.send({message: 'Success'})
})

//Controller 
const UserController = require('./controller/user') // Complete
const AuthController = require('./controller/auth') // Complete
const LinkController = require('./controller/link') // Complete
const LinkCustomerController = require('./controller/customer')
// const PaymentController = require('./controller/payment')

app.group('/api', (router) => {
    //Auth Handlers
    router.post('/login/v1', AuthController.login)
    router.post('/register/v1', AuthController.register)
    router.post('/forget/v1', AuthController.forget)
    router.patch('/verify/token/:token/v1', AuthController.verifyByEmail)
    router.post('/sendverification/v1', AuthController.sendVerfication)
    router.patch('/user/verify/otp/v1', AuthController.verifyByOTP)

    // Users Handlers For Admin
    router.get('/users/v1', UserController.getUsers)
    router.get('/user/:id/v1', UserController.getUserById)
    router.put('/user/:id/v1', UserController.updateUserById)
    router.post('/users/v1', UserController.createUser)
    router.patch('/user/shutdown/:id/v1', UserController.disableById)
    router.delete('/user/:id/v1', UserController.deleteUserById)    

    //Link Handlers For User
    router.get('/user/:userid/links/v1', LinkController.getLinks)
    router.get('/user/:userid/link/:id/v1', LinkController.getLinkById)
    router.put('/user/:userid/link/:id/v1', LinkController.updateLinkById)
    router.post('/user/:userid/link/v1', LinkController.createLinkByUserId)
    router.delete('/user/:userid/link/:id/v1', LinkController.deleteLinkByUserId)
    router.patch('/user/userid/link/:id/redirect/v1', LinkController.redirectLink)

    //For User Costumers
    router.get('link/:url_out', LinkCustomerController.Linking)
})

app.listen(9000, ()=> console.log('Run Server'))

module.exports = {
    app
}