const TBLink = require('./../models').link

exports.Linking = async (req, res) => {
    try {
        const url_out = req.params.url_out
        const ipaddress = req.body.ipaddress
        await TBLink.findOne({ where: { url_out } })
            .then(function (item) {
                if (item.id !== undefined) {
                    if (item.redirect == false) {
                        if (ipaddress == item.ipaddress) {
                            res.send({
                                code: 200,
                                url: item.url_in
                            })
                        } else {
                            TBLink.update({ click: item.click + 1 }, { where: { id: item.id } })
                                .then(function (item) {
                                    res.send({
                                        code: 200,
                                        url: item.url_in
                                    })
                                })
                                .catch(function (err) {
                                    res.send({
                                        code: 401,
                                        message: 'Failed',
                                        error: err
                                    })
                                })
                        }
                    } else {
                        if (ipaddress == item.ipaddress) {
                            res.writeHead(301, { "Location": item.url_in });
                            return res.end();
                        } else {
                            TBLink.update({ click: item.click + 1 }, { where: { id: item.id } })
                                .then(function (item) {
                                    res.writeHead(301, { "Location": item.url_in });
                                    return res.end();
                                })
                                .catch(function (err) {
                                    res.send({
                                        code: 401,
                                        message: 'Failed',
                                        error: err
                                    })
                                })
                        }
                    }
                } else {
                    res.send({
                        code: 500,
                        message: 'Cannot Find Url'
                    })
                }
            })
            .catch(function (err) {
                res.send({
                    code: 300,
                    message: 'Cannot Find Data',
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