export default function handler(req, res) {
    res.status(200).json({ authKey: process.env.PREFILLED_FORM_ID || "Not Set" });
}
