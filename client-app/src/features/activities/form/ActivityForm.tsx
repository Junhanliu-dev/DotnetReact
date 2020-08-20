import React, {useState, FormEvent} from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/activity'
import {v4 as uuid} from 'uuid';


interface IProps {
    setEditMode: (set: boolean) => void;
    activity: IActivity | null;
    createActivity: (activity: IActivity) => void;
    editActivity: (activity: IActivity) => void;
}

export const ActivityForm: React.FC<IProps> = ({
    setEditMode,
    activity: initialFormState, 
    createActivity,
    editActivity
}) => {

    const initializeForm = () => {
        if(initialFormState){
            return initialFormState;
        }
        else{
            return {
                id:'',
                title: '',
                description:'',
                category: '',
                date:'',
                city:'',
                venue:''
            }
        }
    }

    const handleSubmit = () => {
        
        if(activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity);
        }
        else{
            editActivity(activity);
        }

    }


    const [activity,setActivity] = useState<IActivity>(initializeForm);



    const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name,value} = event.currentTarget;
    
        setActivity({...activity,[name]:value});

    }

    return (
        <Segment clearing>
            <Form onSubmit={handleSubmit}>
                <Form.Input name='title' placeholder='Title' value={activity.title} onChange={handleInputChange}/>
                <Form.TextArea name='description' rows={2} placeholder='Description' value={activity.description} onChange={handleInputChange}/>
                <Form.Input name='category' placeholder='Category' value={activity.category} onChange={handleInputChange}/>
                <Form.Input name='date' type='datetime-local' placeholder='Date' value={activity.date} onChange={handleInputChange}/>
                <Form.Input name='city' placeholder='City' value={activity.city} onChange={handleInputChange}/>
                <Form.Input name='venue' placeholder='Venue' value={activity.venue} onChange={handleInputChange}/>
                <Button floated='right' positive type='submit' content='Submit'></Button>
                <Button floated='right' type='submit' content='Cancel' onClick={() => setEditMode(false)}></Button>
        
            </Form>
        </Segment>
    )
}