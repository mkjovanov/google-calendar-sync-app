import { useState } from 'react';
import { CalendarEventList } from './components/CalendarEventList';
import { AddCalendarEventForm } from './components/AddCalendarEventForm';

function App() {
  const [isAddFormActive, setIsAddFormActive] = useState<boolean>(false);

 return isAddFormActive ? 
    <AddCalendarEventForm onBackToEventListCallback={() => { setIsAddFormActive(false) }}/> : 
    <CalendarEventList onAddFormCallback={() => { setIsAddFormActive(true) }}/>
}

export default App;
