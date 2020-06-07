const request = require("request");

module.exports = (req, res) => {
  const waitingOnOscar = false;
  let uri;
  if (process.env.DEBUG === "true") {
    uri = "http://localhost:8080/api/packages";
  } else {
    uri = "https://x.nest.land/api/packages";
  }
  if (waitingOnOscar) {
    return res.status(400).json({ errorMessage: "cheese" });
  } else {
    const requestOptions = {
      uri: uri,
      json: true,
    };
    request.get(requestOptions, function (err, response, body) {
      if (err) {
        return res.status(500).json(
          { errorMessage: "oops, something went wrong on our side" },
        );
      }
      res.status(201).json({ body });
    });
  }
};
