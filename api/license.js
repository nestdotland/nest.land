const axios = require("axios");

module.exports = (req, res) => {
  if (req.body.data.pkg === null)
    return res.status(500).json({ error: true, message: "No package specified" });

  axios
    .get(`https://x.nest.land/${req.body.data.pkg}/LICENSE`)
    .then(({ data }) => {
      console.log(data);
    })
    .catch(() => {
      axios
        .get(`https://x.nest.land/${req.body.data.pkg}/LICENSE.md`)
        .then(({ data }) => console.log(data));
    });

}