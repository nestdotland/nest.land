import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from "https://deno.land/x/lambda/mod.ts";

export async function handler(
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> {
  const header = {
    "content-type": "json; charset=utf-8",
  };
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "reCaptcha Token is required" }),
      headers: header,
    };
  }
  const captchaToken = JSON.parse(event.body).body;
  try {
    const payload = "secret=" + Deno.env.get("CAPTCHA_SECRET") +
      "&response=" + captchaToken;
    const resp = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          secret: Deno.env.get("CAPTCHA_SECRET"),
          response: captchaToken,
        }),
      },
    );
    const body = await resp.json();
    console.log("body", body);
    // if (resp.body === null || !resp.body.success) {
    //   return {
    //     statusCode: 500,
    //     body: JSON.stringify({ message: "You are a bot! Leave now!" }),
    //     headers: header,
    //   };
    // }
    return {
      statusCode: 201,
      body: JSON.stringify(
        { message: "Congratulations! We think you are human." },
      ),
      headers: header,
    };
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        { message: "Oops, something went wrong on our end!" },
      ),
      headers: header,
    };
  }
}
