import { Router } from "express";

const router = Router();

router.use((_req, res) => {
  res.status(501).json({ message: "Not implemented yet" });
});

export default router;
