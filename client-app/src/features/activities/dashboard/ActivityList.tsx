import React, { Fragment, useContext } from "react";
import { Item, Label, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/ActivityStore";
import { ActivityListItem } from "./ActivityListItem";

const ActivityList: React.FC = () => {
    const { activitiesByDate } = useContext(ActivityStore);

    return (
        <Fragment>
            {activitiesByDate.map(([group, activities]) => (
                <Fragment key={group}>
                    <Label color="blue" size="large">
                        {group}
                    </Label>
                    <Segment clearing>
                        <Item.Group divided>
                            {activities.map((activity) => (
                                <ActivityListItem
                                    key={activity.id}
                                    activity={activity}
                                />
                            ))}
                        </Item.Group>
                    </Segment>
                </Fragment>
            ))}
        </Fragment>
    );
};

export default observer(ActivityList);
