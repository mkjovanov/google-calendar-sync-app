import { useState } from "react";

import { AddCalendarEventForm } from "./components/AddCalendarEventForm";
import { CalendarEventList } from "./components/CalendarEventList";

function App() {
  const [isAddFormActive, setIsAddFormActive] = useState<boolean>(false);

  return isAddFormActive ? (
    <AddCalendarEventForm
      onBackToEventListCallback={() => {
        setIsAddFormActive(false);
      }}
    />
  ) : (
    <CalendarEventList
      onAddFormCallback={() => {
        setIsAddFormActive(true);
      }}
    />
  );
}

export default App;
