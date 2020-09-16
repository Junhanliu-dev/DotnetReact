import React, {useEffect, Fragment, useContext } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { LoadingComponent } from "./LoadingComponent";
import ActivityStore from "../stores/ActivityStore";
import {observer} from 'mobx-react-lite';

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {

    activityStore.loadActivities();
    //adding second parameter in useEffect to ensure the render take once only,
    //otherwise it will be endless loop.
  }, [activityStore]);

  if(activityStore.loadingInitial) return <LoadingComponent content='Loading ...' inverted= {true} />

  return (
    <Fragment>
      <NavBar/>
    
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard />
      </Container>
    </Fragment>
  );
};

export default observer(App);
