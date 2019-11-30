const TBLink = require('./../models').link

exports.Linking = async (req, res) => {
    try {
        const url_out = req.params.url_out
        await TBLink.findOne({ where: { url_out } })
            .then(function (item) {
                if (item.id !== undefined) {
                    if (item.redirect == false) {
                        res.send({
                            code: 200,
                            url: item.url_in
                        })
                    } else {
                        res.writeHead(301, { "Location": item.url_in });
                        return res.end();
                    }
                } else {
                    res.send({
                        code: 500,
                        message: 'Cannot Find Url'
                    })
                }
            })
            .catch(function(err){
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