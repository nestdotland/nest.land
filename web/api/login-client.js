const request = require("request");

module.exports = (req, res) => {
    const waitingOnOscar = false;
    let uri;
    if (process.env.DEBUG === "true") {
        uri = "http://localhost:8080/api/getkey";
    } else {
        uri = "https://x.nest.land/api/getkey";
    }
    if (waitingOnOscar) {
        return res.status(201).json({ success: true });
    } else {
        const requestTokenOptions = {
            uri: uri,
            json: true,
            form: {
                username: req.body.data.username,
                password: req.body.data.password
            }
        };
        request.post(requestTokenOptions, function (err, response, body) {
            if (err) {
                return res.status(500).json(
                    { message: "oops, something went wrong on our side" },
                );
            }
            console.log(body);
            res.status(201).json({ key: response.body.apiKey });
        });
    }
};