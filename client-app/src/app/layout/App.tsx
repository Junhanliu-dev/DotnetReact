import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import { observer } from "mobx-react-lite";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { HomePage } from "../../features/Home/HomePage";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "./NotFound";
import { ToastContainer } from "react-toastify";

const App: React.FC<RouteComponentProps> = ({ location }) => {
  return (
    <Fragment>
      <Route exact path="/" component={HomePage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <Fragment>
            <ToastContainer />
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route exact path="/" component={HomePage} />
                <Route exact path="/activities" component={ActivityDashboard} />
                <Route exact path="/activities/:id" component={ActivityDetails} />
                <Route
                  key={location.key}
                  exact
                  path={["/createActivity", "/manage/:id"]}
                  component={ActivityForm}
                />
                /** eventually, if router cannot found any path
                    it will be redirected to this component **/
                <Route component={NotFound} />
              </Switch>
            </Container>
          </Fragment>
        )}
      />
    </Fragment>
  );
};

export default withRouter(observer(App));
