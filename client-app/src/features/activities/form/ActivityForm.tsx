import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/ActivityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface DetailParams {
    id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
    match,
    history,
}) => {
    const {
        loadActivity,
        createActivity,
        editActivity,
        submitting,
        activity: initialFormState,
        clearActivity,
    } = useContext(ActivityStore);

    const handleSubmit = () => {
        if (activity.id.length === 0) {
            let newActivity = {
                ...activity,
                id: uuid(),
            };

            createActivity(newActivity).then(() =>
                history.push(`/activities/${newActivity.id}`)
            );
        } else {
            editActivity(activity).then(() =>
                history.push(`/activities/${activity.id}`)
            );
        }
    };

    const [activity, setActivity] = useState<IActivity>({
        id: "",
        title: "",
        description: "",
        category: "",
        date: "",
        city: "",
        venue: "",
    });

    useEffect(() => {
        if (match.params.id && activity.id.length === 0) {
            //this is async function
            loadActivity(match.params.id).then(
                () => initialFormState && setActivity(initialFormState)
            );
        }

        return () => {
            clearActivity();
        };
    }, [
        loadActivity,
        clearActivity,
        initialFormState,
        activity.id.length,
        match.params.id,
    ]);

    const handleInputChange = (
        event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = event.currentTarget;

        setActivity({ ...activity, [name]: value });
    };

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <Form onSubmit={handleSubmit}>
                        <Form.Input
                            name="title"
                            placeholder="Title"
                            value={activity.title}
                            onChange={handleInputChange}
                        />
                        <Form.TextArea
                            name="description"
                            rows={2}
                            placeholder="Description"
                            value={activity.description}
                            onChange={handleInputChange}
                        />
                        <Form.Input
                            name="category"
                            placeholder="Category"
                            value={activity.category}
                            onChange={handleInputChange}
                        />
                        <Form.Input
                            name="date"
                            type="datetime-local"
                            placeholder="Date"
                            value={activity.date}
                            onChange={handleInputChange}
                        />
                        <Form.Input
                            name="city"
                            placeholder="City"
                            value={activity.city}
                            onChange={handleInputChange}
                        />
                        <Form.Input
                            name="venue"
                            placeholder="Venue"
                            value={activity.venue}
                            onChange={handleInputChange}
                        />
                        <Button
                            loading={submitting}
                            floated="right"
                            positive
                            type="submit"
                            content="Submit"
                        ></Button>
                        <Button
                            floated="right"
                            type="submit"
                            content="Cancel"
                            onClick={() => history.push("/activities")}
                        ></Button>
                    </Form>
                </Segment>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityForm);
