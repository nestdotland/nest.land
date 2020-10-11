import { NowRequest, NowResponse } from "@vercel/node";
import axios from "axios";

export default (req: NowRequest, res: NowResponse) => {
  const { mod } = req.query;
  if(mod === null || mod === undefined || mod === "" || typeof mod === "object") return res.status(500).json({ message: "Wrong request" });

  axios
    .get(`https://x.nest.land/${mod}/README.md`)
    .then(({ data }) => {
      // replace html href attrs
      data = data.replace(
        /(?<=((href)=("|')))(?!(http|https))(?!#)([^\s\\]*)(?=("|'))/g,
        (replaceVal) =>
          `/package/${mod.split("@")[0]}/files/${replaceVal.replace(
            /^(\/|\.\/)/,
            ""
          )}`
      );
      // replace html src attrs
      data = data.replace(
        /(?<=((src)=("|')))(?!(http|https))(?!#)([^\s\\]*)(?=("|'))/g,
        (replaceVal) =>
          `https://x.nest.land/${mod}/${replaceVal.replace(
            /^(\/|\.\/)/,
            ""
          )}`
      );
      // replace imgs
      data = data.replace(
        /(?<=((\!\[(.*)\])\())(?!(http|https))([^\s\\]*)(?=(\)))/g,
        (replaceVal) =>
          `https://x.nest.land/${mod}/${replaceVal.replace(
            /^(\/|\.\/)/,
            ""
          )}`
      );
      // replace links
      data = data.replace(
        /(?<!((!\[(.*)\])\())(?<=((\[(.*)\])\())(?!(http|https))(?!#)([^\s\\]*)(?=(\)))/g,
        (replaceVal) =>
          `/package/${mod.split("@")[0]}/files/${replaceVal.replace(
            /^(\/|\.\/)/,
            ""
          )}`
      );
      // replace unnecessary "$"s
      data = data.replace(/(?<=((```(bash|sh|))([\r\n]+)( *)))\$( ?)/gm, "");
      return res.status(200).send(data);
    })
    .catch(({ response }) => res.status(response.status).json({ message: "There was an error while fetching the README." }));
}