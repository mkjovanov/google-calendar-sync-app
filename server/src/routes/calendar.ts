import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getGoogleClient } from "../google/googleClient";
import { google } from "googleapis";

const router = Router();

router.get("/events", requireAuth, async (req, res) => {
  try {
    const user = (req as any).currentUser;
    const auth = await getGoogleClient(user);
    const calendar = google.calendar({ version: "v3", auth });

    const events = await calendar.events.list({
      calendarId: "primary",
      maxResults: 20,
      singleEvents: true,
      orderBy: "startTime",
      timeMin: new Date().toISOString()
    });

    res.json(events.data.items || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load calendar events" });
  }
});

export default router;
