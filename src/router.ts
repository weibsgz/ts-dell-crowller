import { Router, Request, Response } from "express";
const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.send("hello express11!");
});

export default router;
