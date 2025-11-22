import { prisma } from "../prisma";
import { google } from "googleapis";
import { User } from "@prisma/client";
import { getGoogleClient } from "../google/googleClient";

interface NewEventInput {
  summary?: string;
  start: string;
  end: string;
}

export async function createEventForUser(user: User, input: NewEventInput) {
    const auth = await getGoogleClient(user);
    const calendar = google.calendar({ version: "v3", auth });

    // 1️⃣ Create the event on Google Calendar
    const googleResponse = await calendar.events.insert({
    calendarId: "primary",
    requestBody: {
        summary: input.summary,
        start: { dateTime: new Date(input.start).toISOString() },
        end: { dateTime: new Date(input.end).toISOString() }
    }
    });

    const gEvent = googleResponse.data;

    // 2️⃣ Create local DB record
    const localEvent = await prisma.localEvent.create({
    data: {
        userId: user.id,
        googleEventId: gEvent.id!,
        summary: input.summary ?? null,
        start: new Date(input.start),
        end: new Date(input.end),
        lastLocalEdit: new Date(),
        lastGoogleEdit: gEvent.updated ? new Date(gEvent.updated) : null
    }
    });

    return localEvent;
}
