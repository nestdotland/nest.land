const request = require("request");

module.exports = (req, res) => {
    let uri;
    if (process.env.DEBUG === "true") {
        uri = "http://localhost:8080/api/signup";
    } else {
        uri = "https://x.nest.land/api/signup";
    }
    const signupOptions = {
        uri: uri,
        headers: {
            "X-Secret-Salt": process.env.X_SECRET_SALT,
            "X-Secret-Hash": process.env.X_SECRET_HASH
        },
        json: true,
        form: {
            username: req.body.data.username,
            password: req.body.data.password
        }
    };
    request.post(signupOptions, function (err, response, body) {
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