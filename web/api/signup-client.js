const request = require("request");

module.exports = (req, res) => {
    const waitingOnOscar = false;
    let uri;
    if (process.env.DEBUG === "true") {
        uri = "http://localhost:8080/api/signup";
    } else {
        uri = "https://x.nest.land/api/signup";
    }
    if (waitingOnOscar) {
        return res.status(201).json({ success: true });
    } else {
        const signupOptions = {
            uri: uri,
            json: true,
            form: {
                username: req.body.data.username,
                password: req.body.data.password
            }
        };
        request.post(signupOptions, function (err, response, body) {
            if (err) {
                return res.status(500).json(
                    { message: "oops, something went wrong on our side" },
                );
            }
            console.log(response.body);
            res.status(201).json({ key: response.body.apiKey });
        });
    }
};