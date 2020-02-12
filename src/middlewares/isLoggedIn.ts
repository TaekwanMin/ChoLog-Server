import { Request, Response, NextFunction } from "express";

export default (req: Request, res: Response, next: NextFunction): void => {
  if (req.headers.authorization) {
    next();
  } else {
    res.status(403).send("로그인 필요");
  }
};

// passport.authenticate("jwt", { session: false })
