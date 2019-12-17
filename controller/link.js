const TBLink = require('./../models').link
const TBLimit = require('./../models').limit

exports.getLinks = async (req, res) => {
    try {
        const user_id = req.user.userid
        await TBLink.findAll({ where: { user_id } })
            .then(function (item) {
                if (item.length > 0) {
                    res.send({
                        code: 200,
                        item
                    })
                } else {
                    res.send({
                        code: 204,
                        message: 'Data kosong',
                        item: []
                    })
                }
            })
            .catch(function (err) {
                res.send({
                    code: 203,
                    message: 'Error Cannor fecth Data',
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

exports.getLinkById = async (req, res) => {
    try {
        const id = req.params.id
        const userid = req.user.userid
        await TBLink.findOne({ where: { id, user_id: userid } })
            .then(function (item) {
                res.send({
                    code: 200,
                    message: 'Success',
                    data: item
                })
            })
            .catch(function (err) {
                res.send({
                    code: 203,
                    message: 'Failed',
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

exports.updateLinkById = async (req, res) => {
    const Ips = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    const IP = await Ips.split(":")[Ips.split(":").length - 1]
    const IPs = IP.split(",")[0]
    try {
        const id = req.params.id
        const userid = req.user.userid
        await TBLink.update({
            title: req.body.title,
            url_in: req.body.url_in,
            ipaddress: IPs,
            redirect: req.body.redirect,
            updatedAt: new Date()
        },
            {
                where: { id, user_id: userid }
            })
            .then(function (item) {
                res.send({
                    code: 201,
                    message: 'Success'
                })
            })
            .catch(function (err) {
                res.send({
                    code: 203,
                    message: 'Failed',
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
function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
exports.createLinkByUserId = async (req, res) => {
    try {
        const Ips = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        const IP = await Ips.split(":")[Ips.split(":").length - 1]
        const IPs = IP.split(",")[0]
        const url_out = await makeid(6)
        const userid = req.user.userid
        await TBLink.create({
            title: req.body.title,
            url_in: req.body.url_in,
            url_out,
            user_id: userid,
            ipaddress: IPs,
            redirect: req.body.redirect,
            click: 0,
            createdAt: new Date(),
            updatedAt: new Date()
        })
            .then(function (item) {
                TBLimit.findOne({ where: { userid } })
                .then(result => {
                    req.body.redirect == true ?
                    TBLimit.update({
                        limitLink: result.limitLink - 1,
                        limitRedirect: result.limitRedirect -1,
                        updateAt: new Date()
                    },{where: {userid}})
                    :
                    TBLimit.update({
                        limitLink: result.limitLink - 1,
                        updateAt: new Date()
                    },{where: {userid}})
                })
                res.send({
                    code: 200,
                    message: 'Success',
                    result: item
                })
            })
            .catch(function (err) {
                res.send({
                    code: 203,
                    message: 'Failed',
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

exports.deleteLinkByUserId = async (req, res) => {
    try {
        const id = req.params.id
        const user_id = req.user.userid
        await TBLink.destroy({ where: { id, user_id } })
            .then(function (item) {
                res.send({
                    code: 201,
                    message: 'Success'
                })
            })
            .catch(function (err) {
                res.send({
                    code: 203,
                    message: 'Failed',
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

exports.redirectLink = async (req, res) => {
    try {
        const id = req.params.id
        const user_id = req.user.userid
        await TBLink.update({
            redirect: req.body.redirect
        }, {
            where: { id, user_id }
        })
            .then(function (item) {
                res.send({
                    code: 201,
                    message: 'Success'
                })
            })
            .catch(function (err) {
                res.send({
                    code: 203,
                    message: 'Failed',
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