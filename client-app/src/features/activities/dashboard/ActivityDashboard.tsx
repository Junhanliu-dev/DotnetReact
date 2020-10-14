import React, { useContext, useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { observer } from "mobx-react-lite";
import ActivityStore from "../../../app/stores/ActivityStore";
import { LoadingComponent } from "../../../app/layout/LoadingComponent";

const ActivityDashboard: React.FC = () => {
    const activityStore = useContext(ActivityStore);

    useEffect(() => {
        activityStore.loadActivities();
        //adding second parameter in useEffect to ensure the render take once only,
        //otherwise it will be endless loop.
    }, [activityStore]);

    if (activityStore.loadingInitial)
        return <LoadingComponent content="Loading ..." inverted={true} />;

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityList />
            </Grid.Column>
            <Grid.Column width={6}>
                <h2>Activity filters</h2>
            </Grid.Column>
        </Grid>
    );
};

export default observer(ActivityDashboard);
