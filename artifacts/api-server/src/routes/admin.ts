import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, quoteSubmissionsTable } from "@workspace/db";
import { ListSubmissionsResponse } from "@workspace/api-zod";
import { desc, eq } from "drizzle-orm";

const router: IRouter = Router();

function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    next();
    return;
  }
  const auth = req.headers["authorization"] ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (token !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.use("/admin", requireAdminAuth);

router.get("/admin/submissions", async (req, res): Promise<void> => {
  const submissions = await db
    .select()
    .from(quoteSubmissionsTable)
    .orderBy(desc(quoteSubmissionsTable.createdAt));

  res.json(ListSubmissionsResponse.parse(submissions));
});

router.delete("/admin/submissions/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deleted] = await db
    .delete(quoteSubmissionsTable)
    .where(eq(quoteSubmissionsTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Submission not found" });
    return;
  }

  res.sendStatus(204);
});

export default router;
