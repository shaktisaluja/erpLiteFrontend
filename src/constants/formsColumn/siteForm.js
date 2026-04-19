import moment from "moment-timezone";

export const siteStatusOptions = [
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" }
];

export const siteDefaultValues = {
    name: "",
    code: "",
    organization: "",
    location: "",
    address: "",
    city: "",
    state: "",
    country: "",
    status: "ACTIVE",
    timezone: ""
};

export const siteTimeZoneOptions = moment.tz.names().map((tz) => ({
    label: tz,
    value: tz
}));
