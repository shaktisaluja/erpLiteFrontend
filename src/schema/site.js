import { z } from "zod";
import moment from "moment-timezone";

const timeZones = moment.tz.names();

export const siteSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Site name must be at least 3 characters long"),
    code: z
        .string()
        .trim()
        .min(2, "Code must be at least 2 characters long"),
    organization: z
        .string()
        .trim()
        .min(1, "Organization is required"),
    location: z
        .string()
        .trim()
        .min(2, "Location must be at least 2 characters long"),
    address: z
        .string()
        .trim()
        .min(5, "Address must be at least 5 characters long"),
    city: z
        .string()
        .trim()
        .min(2, "City must be at least 2 characters long"),
    state: z
        .string()
        .trim()
        .min(2, "State must be at least 2 characters long"),
    country: z
        .string()
        .trim()
        .min(2, "Country must be at least 2 characters long"),
    status: z.enum(["ACTIVE", "INACTIVE"], {
        errorMap: () => ({ message: "Invalid status" })
    }),
    timezone: z
        .string()
        .refine((val) => timeZones.includes(val), {
            message: "Invalid time zone"
        })
});
