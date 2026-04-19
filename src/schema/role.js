import { z } from "zod";

export const roleSchema = z.object({
  name: z.string().min(3, "Role name must be at least 3 characters long"),
  organization: z.string().min(1, "Organization is required"),
  status: z.enum(["active", "inactive"]),
  permissions: z.array(z.string()).min(1, "At least one permission must be selected"),
});
