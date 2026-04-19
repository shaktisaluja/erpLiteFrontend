import { z } from "zod";
import moment from "moment-timezone";

const timeZones = moment.tz.names();

export const organizationSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Organization name must be at least 3 characters long"),

    industry: z
        .string()
        .trim()
        .min(3, "Industry name must be at least 3 characters long"),

    email: z
        .string()
        .trim()
        .email("Invalid email address"),

    phone: z
        .string()
        .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),

    subscriptionPlan: z.enum(
        ["free", "basic", "premium","enterprise"],
        {
            errorMap: () => ({ message: "Invalid subscription plan" })
        }
    ),

    status: z.enum(
        ["active", "inactive"],
        {
            errorMap: () => ({ message: "Invalid status" })
        }
    ),

    timezone: z
        .string()
        .refine((val) => timeZones.includes(val), {
            message: "Invalid time zone"
        }),
});