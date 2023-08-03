import jwt from "jsonwebtoken";
import express from "express";

export const SECRET = 'SECr3t';  // This should be in an environment variable in a real application

  export const authenticateJwt = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      if (!user || (typeof(user) === "string"))
      {
        return res.sendStatus(403);
      }

      req.headers["userID"] = user.id;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};