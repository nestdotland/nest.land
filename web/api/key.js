const request = require("request");

module.exports = (req, res) => {
    const waitingOnOscar = true;  // TODO: CHANGE THIS WHEN OSCAR IS DONE WITH API
    if (!req.body) {
        return res.status(400).json({ message: "You are required to pass the reCaptcha. Nice try, BOT!" });
    }
    if (waitingOnOscar) {
        return res.status(201).json({ token: 'cheese' });
    } else {
        const requestTokenOptions = {
            uri: "https://api.nest.land/signup",
            json: true,
            form: {
                // TODO: FILL THIS IN
                // secret: process.env.CAPTCHA_SECRET
            }
        };
        request.post(requestTokenOptions, function (err, response, body) {
            if (err) {
                return res.status(500).json({ message: "oops, something went wrong on our side" });
            }
            if (!body.success) {
                return res.status(500).json({ message: body["error-codes"].join(".") });
            }
            res.status(201).json({ token: response.token });
        });
    }
};