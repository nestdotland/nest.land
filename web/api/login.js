const request = require("request");

module.exports = (req, res) => {
    const waitingOnOscar = false;
    let uri;
    if (process.env.DEBUG === "true") {
        uri = "http://localhost:8080/login";
    } else {
        uri = "https://api.nest.land/login";
    }
    if (waitingOnOscar) {
        return res.status(201).json({ success: true });
    } else {
        // TODO: VERIFY USER CREDENTIALS ARE VALID
        const requestTokenOptions = {
            uri: uri,
            json: true,
        };
        request.post(requestTokenOptions, function (err, response, body) {
            if (err) {
                return res.status(500).json(
                    { message: "oops, something went wrong on our side" },
                );
            }
            res.status(201).json({ token: response.token });
        });
    }
};