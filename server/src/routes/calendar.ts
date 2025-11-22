import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import { getGoogleClient } from "../google/googleClient";
import { google } from "googleapis";
import { prisma } from "../prisma";
import { syncGoogleToLocal } from "../google/syncGoogleToLocal";
import { getDateInFuture } from "../utils/dateUtils";

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

router.get('/local-events', requireAuth, async (req, res) => {
  const user = (req as any).currentUser;
  await syncGoogleToLocal(user);

  const queryTimeframe = req.query['timeframe'] as string;

  const localEvents = await prisma.localEvent.findMany({
    where: {
    start: {
      gte: new Date(),
      lte: getDateInFuture(parseInt(queryTimeframe || '7'))
    },
    deleted: false
  },
  orderBy: {
    start: "asc"
  }
  });

  res.json(localEvents);
});

export default router;
