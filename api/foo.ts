import { ServerRequest } from 'https://deno.land/std@0.70.0/http/server.ts';
import { importTree } from "./analyzer/tree.ts";

export default async (req: ServerRequest) => {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  const res = await Deno.readAll(req.body);
  console.log(res)

  // const entrypoint = url.searchParams.get("file");
  
  try {
    throw new Error("test");
    const res = await importTree("https://x.nest.land/denon@2.3.2/mod.ts");
    
	  req.respond({
      status: 200,
      body: JSON.stringify(res.tree),
      headers,
    })
  } catch (err) {
    req.respond({
      status: 400,
      body: `{
        "error": "Error during import analysis.",
        "message": ${JSON.stringify(err.message)},
        "stack": ${JSON.stringify(err.stack)}
      }`,
      headers,
    })
  }
};