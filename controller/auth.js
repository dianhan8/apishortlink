const TBUsers = require('./../models').users
const JWT = require('jsonwebtoken')
const moment = require('moment')

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
                premium: false
            })
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