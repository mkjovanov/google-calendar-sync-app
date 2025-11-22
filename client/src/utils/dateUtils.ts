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
        .map(([date, events]) => ({ date: new Date(date).toDateString(), events }));
}

function getISOWeek(date: Date) {
    const tmp = new Date(date.getTime());
    tmp.setHours(0, 0, 0, 0);

    // Thursday of this week determines the year & week number
    tmp.setDate(tmp.getDate() + 3 - ((tmp.getDay() + 6) % 7));

    const week1 = new Date(tmp.getFullYear(), 0, 4);

    return (
    1 +
    Math.round(
        ((tmp.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) /
        7
    )
    );
}

function getWeekKey(date: Date) {
    const year = date.getFullYear();
    const week = getISOWeek(date);
    return `${year}-W${String(week).padStart(2, "0")}`;
}

function groupEventsByWeek(events: LocalCalendarEvent[]): GroupedLocalCalendarEvent[] {
  const map: Record<string, LocalCalendarEvent[]> = {};

  for (const ev of events) {
    if (!ev.start) continue;

    const start = new Date(ev.start);
    const weekKey = getWeekKey(start);

    if (!map[weekKey]) {
      map[weekKey] = [];
    }

    map[weekKey].push(ev);
  }

  // Sort events inside each week
  for (const key of Object.keys(map)) {
    map[key].sort(
      (a, b) => new Date(a.start!).getTime() - new Date(b.start!).getTime()
    );
  }

  // Return sorted weeks chronologically
  return Object.entries(map)
    .sort(([wkA], [wkB]) => {
      const [yearA, weekA] = wkA.split("-W").map(Number);
      const [yearB, weekB] = wkB.split("-W").map(Number);

      if (yearA !== yearB) return yearA - yearB;
      return weekA - weekB;
    })
    .map(([week, events]) => ({ date: week, events }));
}


export { parseDateStringToUtc, groupEventsByDay, groupEventsByWeek }