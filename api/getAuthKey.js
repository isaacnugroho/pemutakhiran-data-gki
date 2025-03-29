export default function handler(req, res) {
    res.json({ authKey: process.env.FORM_ID || "Not Set" });
}
