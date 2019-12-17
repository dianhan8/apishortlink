const TBUsers = require('./../models').users
const JWT = require('jsonwebtoken')
const moment = require('moment')
const sendGrid = require('@sendgrid/mail')
const bcrypt = require('bcrypt');
const TBLimit = require('./../models').limit
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTHTOKEN;
const client = require('twilio')(accountSid, authToken)
sendGrid.setApiKey(process.env.SENDGRID_API_KEY);

exports.login = async (req, res) => {
    try {
        const email = req.body.email
        const result = await TBUsers.findOne({ where: { email } })
        if (result) {
            bcrypt.compare(req.body.password, result.password, function (err, results) {
                if (results) {
                    const dateNow = moment(new Date()).add(60, 'minutes')
                    const token = JWT.sign({
                        userid: result.id,
                        name: result.name,
                        expired: dateNow,
                        verifyByEmail: result.verify_email,
                        premium: result.premium
                    }, 'theending')
                    if (token) {
                        res.send({
                            code: 200,
                            name: result.name,
                            token
                        })
                    }

                } else {
                    res.send({
                        code: 301,
                        message: 'Password Salah'
                    })
                }
            });

        } else {
            res.send({
                code: 204,
                message: "Account anda tidak terdaftar."
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
        const password = await bcrypt.hash(req.body.password, 6)
        const findSame = await TBUsers.findAll({ where: { email: req.body.email } })
        if (findSame.length > 0) {
            res.send({
                code: 202,
                message: "Sudah ada users yang memakai email ini."
            })
        } else {
            const create = await TBUsers.create({
                email: req.body.email,
                password,
                name: req.body.name,
                phone_number: req.body.phonenumber,
                payment_number: req.body.paymentnumber,
                disable: false,
                verify_email: false,
                verify_phonenumber: false,
                code_verify: null,
                premium: false,
                createdAt: new Date(),
                updatedAt: new Date()
            })
            const HostUrl = process.env.URL
            const token = await JWT.sign({
                email: req.body.email,
                expired: moment(new Date()).add(60, 'minutes')
            }, 'verify')
            if (token) {
                await TBLimit.create({
                    userId: create.id,
                    limitLink: 1000,
                    limitRedirect: 100
                })
                const msg = {
                    to: req.body.email,
                    from: 'no-reply@nectly.com',
                    subject: 'Welcome to Nectly! Confirm Your Email!',
                    text: 'Welcome to Nectly! Confirm Your Email!',
                    html: `<strong>Confirm Email Now!</strong><br><a href='http://localhost:9000/verify/token/${token}/v1'>Verify</a>`,
                };
                await sendGrid.send(msg);
                res.send({
                    code: 201,
                    message: "Account sudah terbuat, Silakan verifikasi Email Dari sekarang.",
                    ...req.body
                })
            }
        }
    } catch (error) {
        res.send({
            code: 500,
            message: "Tidak bisa Register",
            error: error
        })
    }
}
exports.verifyByEmail = async (req, res) => {
    try {
        const token = await JWT.decode(req.params.token)
        const email = token.email
        const expired = token.expired
        if (new Date() > new Date(expired)) {
            res.send({
                code: 203,
                message: 'Token sudah tidak berlaku!'
            })
        } else {
            await TBUsers.update({ verify_email: true }, { where: { email } })
                .then(function (item) {
                    res.send({
                        code: 201,
                        message: 'Account Sudah Di verifikasi'
                    })
                })
                .catch(function (err) {
                    res.send({
                        code: 202,
                        message: 'Account tidak berhasil Di verifikasi',
                        error: err
                    })
                })
        }
    } catch (error) {
        res.send({
            code: 500,
            message: "Server Error",
            error: error
        })
    }
}

function generateOTP() {
    // Declare a digits variable  
    // which stores all digits 
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

exports.sendVerfication = async (req, res) => {
    try {
        const id = req.user.userid
        const phonenumber = req.body.phonenumber
        const code = generateOTP()
        await TBUsers.update({ code_verify: code }, { where: { id } })
        await client.messages.create({
            body: `Your Nectly Verification Code: ${code}. JANGAN MEMBERITAHU KODE RAHASIA INI KE SIAPAPUN termasuk pihak Nectly.`,
            from: '+12053902209',
            to: phonenumber
        })
            .then(message => res.send({
                code: 200,
                status: message.status,
                message: 'Kode verifikasi anda sudah di Kirim'
            }))
            .catch(error => res.send({
                code: 202,
                status: 'Failed',
                message: 'Kode Tidak berhasil dikirim',
                error: error
            }))
    } catch (error) {
        res.send({
            code: 500,
            message: "Server Error",
            error: error
        })
    }
}

exports.verifyByOTP = async (req, res) => {
    try {
        const code = req.body.code
        const id = req.user.userid
        const findSame = await TBUsers.findOne({ where: id, code_verify: code })
        if (findSame.id !== undefined) {
            await TBUsers.update({ verify_phonenumber: true }, { where: id })
            res.send({
                code: 201,
                message: 'Account has Verified'
            })
        } else {
            res.send({
                code: 204,
                message: 'Account not find in database'
            })
        }
    } catch (error) {
        res.send({
            code: 500,
            message: "Server Error",
            error: error
        })
    }
}

exports.forget = async (req, res) => {
    try {
        const email = req.body.email
        await TBUsers.findOne({ where: { email } })
            .then(function (item) {
                if (item.id !== undefined) {
                    client.messages
                        .create({
                            body: `Your Nectly Verification Code: ${item.code_verify}. JANGAN MEMBERITAHU KODE RAHASIA INI KE SIAPAPUN termasuk pihak Nectly.`,
                            from: '+12053902209',
                            to: item.phone_number
                        })
                        .then(message => res.send({
                            code: '200',
                            status: message.status,
                            message: 'Kode verifikasi anda sudah di Kirim'
                        }))
                        .catch(error => res.send({
                            code: '202',
                            status: 'Failed',
                            message: 'Kode Tidak berhasil dikirim',
                            error: error
                        }))
                } else {
                    res.send({
                        code: '202',
                        message: 'Email Yang di input tidak ada!'
                    })
                }
            })
            .catch(function (err) {
                res.send({
                    code: '203',
                    message: 'Error Cant Forget Password',
                    error: err
                })
            })
    } catch (error) {
        res.send({
            code: 500,
            message: "Server Error",
            error: error
        })
    }
}