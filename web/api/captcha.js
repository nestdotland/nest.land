const request = require("request");

module.exports = (req, res) => {
    if (!req.body.recaptchaToken) {
        return res.status(400).json({ message: "recaptchaToken is required" });
    }
    const verifyCaptchaOptions = {
        uri: "https://www.google.com/recaptcha/api/siteverify",
        json: true,
        form: {
            secret: process.env.CAPTCHA_SECRET,
            response: req.body.recaptchaToken
        }
    };
    request.post(verifyCaptchaOptions, function (err, response, body) {
        if (err) {
            return res.status(500).json({ message: "oops, something went wrong on our side" });
        }
        if (!body.success) {
            return res.status(500).json({ message: body["error-codes"].join(".") });
        }
        res.status(201).json({ message: "Congratulations! We think you are human." });
    });
};