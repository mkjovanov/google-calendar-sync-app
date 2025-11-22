import { useState, type ChangeEvent, type FC, type FormEvent } from "react";
import { addEvent } from "../api";

interface AddCalendarEventFormProps {
    onBackToEventListCallback: VoidFunction;
}

export const AddCalendarEventForm: FC<AddCalendarEventFormProps> = ({onBackToEventListCallback}) => {
    const [formData, setFormData] = useState({ name: '', date: '', startTime: '', endTime: '' });
    console.log(formData);

      const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        addEvent(
            formData.name, 
            formData.date + 'T' + formData.startTime, 
            formData.date + 'T' + formData.endTime
        );
        onBackToEventListCallback();
    }

    return  <form style={{display: 'flex', flexDirection: 'column', paddingLeft: '1rem', gap: '1rem'}} onSubmit={handleSubmit}>
                <button onClick={onBackToEventListCallback}>&#8249; Back to event list</button>
                <input type='text' placeholder="Event name"  onChange={handleChange} name='name'></input>
                <input type='date' placeholder="Date" onChange={handleChange} name='date'></input>
                <input type='time' placeholder='Start time' onChange={handleChange} name='startTime'></input>
                <input type='time' placeholder='End time' onChange={handleChange} name='endTime'></input>
                <button type='submit'>Add event</button>
            </form>
}