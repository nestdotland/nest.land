import { NowRequest, NowResponse } from "@vercel/node";
import axios from "axios";

export default (req: NowRequest, res: NowResponse) => {
  const pkg = req.body.data["pkg"];
  if(pkg === null || pkg === undefined || pkg === "") return res.status(500).json({ message: "Wrong request" });

  axios
    .get(`https://x.nest.land/${pkg}/README.md`)
    .then(({ data }) => {
      // replace html href attrs
      data = data.replace(
        /(?<=((href)=("|')))(?!(http|https))([^\s\\]*)(?=("|'))/g,
        (replaceVal) =>
          `/package/${pkg.split("@")[0]}/files/${replaceVal.replace(
            /\/|\.\//,
            ""
          )}`
      );
      // replace html src attrs
      data = data.replace(
        /(?<=((src)=("|')))(?!(http|https))([^\s\\]*)(?=("|'))/g,
        (replaceVal) =>
          `https://x.nest.land/${pkg}/${replaceVal.replace(
            /\/|\.\//,
            ""
          )}`
      );
      // replace imgs
      data = data.replace(
        /(?<=((\!\[(.*)\])\())(?!(http|https))([^\s\\]*)(?=(\)))/g,
        (replaceVal) =>
          `https://x.nest.land/${pkg}/${replaceVal.replace(
            /\/|\.\//,
            ""
          )}`
      );
      // replace links
      data = data.replace(
        /(?<!((!\[(.*)\])\())(?<=((\[(.*)\])\())(?!(http|https))([^\s\\]*)(?=(\)))/g,
        (replaceVal) =>
          `/package/${pkg.split("@")[0]}/files/${replaceVal.replace(
            /\/|\.\//,
            ""
          )}`
      );
      return res.status(200).send(data);
    })
    .catch(({ response }) => res.status(response.status).json({ message: "There was an error while fetching the README." }));
}