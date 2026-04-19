import { z } from "zod";

export const userSchema = z.object({
    name: z.string().trim().min(3, "Full name must be at least 3 characters long"),
    email: z.string().trim().email("Invalid email address"),
    phone: z
        .string()
        .trim()
        .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    employeeCode: z.string().trim().min(2, "Employee code must be at least 2 characters long"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    organizationId: z.string().min(1, "Organization is required"),
    roleId: z.string().min(1, "Role is required"),
    siteId: z.string().min(1, "Site is required"),
    departmentId: z.string().min(1, "Department is required"),
    status: z.enum(["active", "inactive"])
});

export const updateUserSchema = userSchema.extend({
    password: z.union([z.string().length(0), z.string().min(6, "Password must be at least 6 characters long")])
});
