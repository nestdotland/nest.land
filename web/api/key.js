const request = require("request");

module.exports = (req, res) => {
  const waitingOnOscar = false;
  let uri;
  if (process.env.DEBUG === "true") {
    uri = "http://localhost:8080/signup";
  } else {
    uri = "https://api.nest.land/signup";
  }
  if (!req.body) {
    return res.status(400).json(
      { message: "You are required to have an account, dummy." },
    );
  }
  if (waitingOnOscar) {
    return res.status(201).json({ token: "cheese" });
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
      if (!body.success) {
        return res.status(500).json({ message: body["error-codes"].join(".") });
      }
      res.status(201).json({ token: response.token });
    });
  }
};
