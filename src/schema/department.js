import { z } from "zod";

export const departmentSchema = z.object({
    name: z.string().trim().min(1, "Department name is required"),
    organization: z
        .string()
        .trim()
        .regex(/^[a-fA-F0-9]{24}$/, "Organization must be a valid 24-character id"),
    description: z.string().nullable().optional().transform((value) => value ?? ""),
    status: z.enum(["active", "inactive"], {
        errorMap: () => ({ message: "Invalid status" })
    })
});
