export default function handler(req, res) {
    res.json({ authKey: process.env.PREFILLED_FORM_ID || "Not Set" });
}
