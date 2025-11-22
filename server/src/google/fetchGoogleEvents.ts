import { google } from "googleapis";
import { getGoogleClient } from "./googleClient";
import { User } from "@prisma/client";
import { getSyncWindow } from "./utils";

export async function fetchGoogleEvents(user: User) {
    const auth = await getGoogleClient(user);
    const calendar = google.calendar({ version: "v3", auth });
    
    const { timeMin, timeMax } = getSyncWindow();

    const res = await calendar.events.list({
        calendarId: "primary",
        showDeleted: true,
        singleEvents: true,
        timeMin: timeMin.toISOString(),
        timeMax: timeMax.toISOString()
    });

    return (res.data.items ?? []).map(event => ({
        ...event,
        updated: event.updated ? new Date(event.updated) : null
    }));
}
