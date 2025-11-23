import { Router } from "express";
import { google } from "googleapis";

import { createEventForUser } from "../google/createEventForUser";
import { getGoogleClient } from "../google/googleClient";
import { syncGoogleToLocal } from "../google/syncGoogleToLocal";
import { requireAuth } from "../middleware/auth";
import { prisma } from "../prisma";
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
      timeMin: new Date().toISOString(),
    });

    res.json(events.data.items || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load calendar events" });
  }
});

router.get("/local-events", requireAuth, async (req, res) => {
  const user = (req as any).currentUser;
  await syncGoogleToLocal(user);

  const queryTimeframe = req.query["timeframe"] as string;

  const localEvents = await prisma.localEvent.findMany({
    where: {
      start: {
        gte: new Date(),
        lte: getDateInFuture(parseInt(queryTimeframe || "7")),
      },
      deleted: false,
    },
    orderBy: {
      start: "asc",
    },
  });

  res.json(localEvents);
});

router.post("/events", requireAuth, async (req, res) => {
  const user = (req as any).currentUser;
  const { summary, start, end } = req.body;

  try {
    const event = await createEventForUser(user, {
      summary,
      start,
      end,
    });

    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create event" });
  }
});

export default router;
