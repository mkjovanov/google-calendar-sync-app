import { User } from "@prisma/client";

import { prisma } from "../prisma";
import { safelyParseDateTime } from "../utils/dateUtils";
import { fetchGoogleEvents } from "./fetchGoogleEvents";
import { getSyncWindow } from "./utils";

export async function syncGoogleToLocal(user: User) {
  const googleEvents = await fetchGoogleEvents(user);

  for (const gEvent of googleEvents) {
    const googleEventId = gEvent.id;
    if (!googleEventId) continue;

    const local = await prisma.localEvent.findUnique({
      where: { googleEventId },
    });

    // event deleted from Google -> mark local deleted
    if (gEvent.status === "cancelled") {
      if (local) {
        await prisma.localEvent.update({
          where: { id: local.id },
          data: { deleted: true, lastGoogleEdit: gEvent.updated },
        });
      }
      continue;
    }

    // exists locally -> check conflicts
    if (local) {
      if (gEvent.updated && (!local.lastGoogleEdit || gEvent.updated > local.lastGoogleEdit)) {
        // Google is newer -> overwrite local
        await prisma.localEvent.update({
          where: { id: local.id },
          data: {
            summary: gEvent.summary ?? null,
            description: gEvent.description ?? null,
            start: safelyParseDateTime(gEvent.start?.date, gEvent.start?.dateTime),
            end: safelyParseDateTime(gEvent.end?.date, gEvent.end?.dateTime),
            lastGoogleEdit: gEvent.updated,
          },
        });
      }
    } else {
      // Google event does not exist locally -> create it
      await prisma.localEvent.create({
        data: {
          userId: user.id,
          googleEventId,
          summary: gEvent.summary ?? null,
          description: gEvent.description ?? null,
          start: safelyParseDateTime(gEvent.start?.date, gEvent.start?.dateTime),
          end: safelyParseDateTime(gEvent.end?.date, gEvent.end?.dateTime),
          lastGoogleEdit: gEvent.updated,
        },
      });
    }
  }

  // CLEANUP: remove local-only events outside sync window
  const { timeMin, timeMax } = getSyncWindow();
  await prisma.localEvent.deleteMany({
    where: {
      userId: user.id,
      googleEventId: null,
      OR: [{ start: { lt: timeMin } }, { end: { gt: timeMax } }],
    },
  });

  await prisma.user.update({
    where: { id: user.id },
    data: { lastCalendarSync: new Date() },
  });
}
