const TBUsers = require('./../models').users
const JWT = require('jsonwebtoken')
const moment = require('moment')
const sendGrid = require('@sendgrid/mail')
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
exports.login = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password
        const result = await TBUsers.findOne({ where: { email, password } })
        if (result) {
            const dateNow = await moment(new Date()).add('minutes', 60)
            const token = await JWT.sign({
                userid: result.id,
                expired: dateNow,
                premium: result.premium
            }, 'theending')
            res.send({
                code: 200,
                name: result.name,
                token
            })
        } else {
            res.send({
                code: 204,
                message: "Wrong Email or Password!"
            })
        }
    } catch (error) {
        res.send({
            code: 500,
            message: "Tidak bisa login",
            error: error
        })
    }
}

exports.register = async (req, res) => {
    try {
        const findSame = await TBUsers.findAll({ where: { email: req.body.email } })
        if (findSame.length > 0) {
            res.send({
                code: 202,
                message: "Sudah ada users yang memakai email anda."
            })
        } else {
            await TBUsers.create({
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                phonenumber: req.body.phonenumber,
                payment_number: req.body.paymentnumber,
                disable: false,
                verify_email: false,
                verify_phonenumber: false,
                premium: false,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            const msg = {
                to: req.body.email,
                from: 'support@nectly.com',
                subject: 'Verify Account',
                text: 'You have time for Verify Email',
                html: `<strong>and easy to do anywhere, even with Node.js</strong><a href=https://active/${req.body.email}>Active</a>`,
              };
            await sendGrid.send(msg);
            res.send({
                code: 201,
                message: "Account sudah terbuat",
                ...req.body
            })
        }
    } catch (error) {
        res.send({
            code: 500,
            message: "Tidak bisa Register",
            error: error
        })
    }
}