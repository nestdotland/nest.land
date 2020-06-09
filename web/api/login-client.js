const request = require("request");

module.exports = (req, res) => {
    let uri;
    if (process.env.DEBUG === "true") {
        uri = "http://localhost:8080/api/getkey";
    } else {
        uri = "https://x.nest.land/api/getkey";
    }
    const requestTokenOptions = {
        uri: uri,
        headers: {
            "X-Secret-Salt": process.env.API_KEY
        },
        json: true,
        form: {
            username: req.body.data.username,
            password: req.body.data.password
        }
    };
    request.post(requestTokenOptions, function (err, response, body) {
        if (err) {
            return res.status(500).json(
                { message: err },
            );
        }
        if (body.success) {
            res.status(201).json({ body });
        }
    });
};