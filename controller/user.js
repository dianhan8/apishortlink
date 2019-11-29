const TBUsers = require('./../models').user

exports.getUsers = async (req, res) => {
    try {
        await TBUsers.findAll()
            .then(function (item) {
                if (item.length > 0) {
                    res.send({
                        code: '200',
                        message: 'Success Fetch Data',
                        item
                    })
                } else {
                    res.send({
                        code: '204',
                        message: 'Data kosong'
                    })
                }
            })
            .catch(function (err) {
                res.send({
                    code: '202',
                    message: 'Transcation Failed',
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

exports.getUserById = (req, res) => {
    try {
        const id = req.params.id
        await TBUsers.findOne({ where: { id } })
            .then(function (item) {
                if (item.id !== undefined) {
                    res.send({
                        code: '200',
                        message: 'Success Get Data Users',
                        data: item
                    })
                } else {
                    res.send({
                        code: '204',
                        message: 'Cannot Find Users Data'
                    })
                }
            })
            .catch(function (err) {
                res.send({
                    code: '202',
                    message: 'Error',
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

exports.updateUserById = async (req, res) => {
    try {
        const id = req.params.id
        await TBUsers.update({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            phonenumber: req.body.phonenumber,
            payment_number: req.body.paymentnumber,
            updatedAt: new Date()
        }, {
            where: { id }
        })
            .then(function (item) {
                res.send({
                    code: '200',
                    message: 'Success'
                })
            })
            .catch(function (err) {
                re.send({
                    code: '204',
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

exports.createUser = async (req, res) => {
    try {
        await TBUsers.create({
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            phonenumber: req.body.phonenumber,
            payment_number: req.body.paymentnumber,
            disable: false,
            verify_email: false,
            verify_phonenumber: false,
            code_verify: null,
            premium: false,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        .then(function(item){
            res.send({
                code: '201',
                message: 'Success',
            })
        })
        .catch(function(err){
            res.send({
                code: '203',
                message: 'Failed'
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

exports.disableById = async(req, res) => {
    try {
        const id = req.params.id
        await TBUsers.update({disable: true},{where: {id}})
        .then(function(item){
            res.send({
                code: '201',
                message: 'Success Shutdown User'
            })
        })
        .catch(function(err){
            res.send({
                code: '301',
                message: 'Failed'
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

exports.deleteUserById = async(req, res) => {
    try {
        const id = req.params.id
        await TBUsers.destroy({where: {id}})
        .then(function(item){
            res.send({
                code: '201',
                message: 'Account Has Deleted'
            })
        })
        .catch(function(err){
            res.send({
                code: '301',
                message: 'Account Cannot Delete',
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