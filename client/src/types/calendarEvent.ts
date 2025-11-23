interface EventTime {
  date?: string;
  dateTime?: string;
  timeZone?: string;
}

export interface CalendarEvent {
  id: string;
  summary: string;
  start: EventTime;
  end: EventTime;
}
