import type { GroupedLocalCalendarEvent, LocalCalendarEvent } from "../types/localCalendarEvent";

const parseDateStringToUtc = (date?: string) => {
    return date ? new Date(date).toUTCString() : 'n/a';
}

function formatDateKey(date: Date) {
  return date.toISOString().split("T")[0];  // "2025-02-20"
}


function groupEventsByDay(events: LocalCalendarEvent[]): GroupedLocalCalendarEvent[] {
    const map: Record<string, LocalCalendarEvent[]> = {};

    for (const ev of events) {
    if (!ev.start) continue;

    const startDate = new Date(ev.start);
    const key = formatDateKey(startDate);

    if (!map[key]) {
        map[key] = [];
    }

    map[key].push(ev);
    }

    // Sort events inside each day
    for (const key of Object.keys(map)) {
    map[key].sort((a, b) => {
        return new Date(a.start!).getTime() - new Date(b.start!).getTime();
    });
    }

    // Return sorted days in order
    return Object.entries(map)
        .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
        .map(([date, events]) => ({ date, events }));
}


export { parseDateStringToUtc, groupEventsByDay }