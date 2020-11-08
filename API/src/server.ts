import express, { NextFunction, Request, Response } from "express";
const port = process.env.PORT || 8080;
const app = express();

app.use((_req: Request, res: Response, next: NextFunction) => {
  // allow calling from different domains
  res.set("Access-Control-Allow-Origin", "*");
  // allow authorization header
  res.set("Access-Control-Allow-Headers", "authorization");
  next();
});

// Allow requests from anyone to the /public route.
app.get("/public", (req: Request, res: Response) => {
  console.log("public");
  // res.set("Access-Control-Allow-Origin", "*");
  res.json({ hello: "world" });
});

// Start the express server.
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
