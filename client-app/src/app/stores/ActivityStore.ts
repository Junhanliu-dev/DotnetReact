import { observable, action, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";
import { IActivity } from "../models/activity";
import agent from "../api/agent";

configure({ enforceActions: "always" });

class ActivityStore {
    @observable loadingInitial = false;
    @observable activity: IActivity | undefined = undefined;
    @observable submitting = false;
    @observable target = "";

    //store activities
    @observable activityRegistry = new Map();

    @computed get activitiesByDate() {
        //ascending date order
        return this.groupActivitiesByDate(
            Array.from(this.activityRegistry.values())
        );
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => Date.parse(a.date) - Date.parse(b.date)
        );
        return Object.entries(
            sortedActivities.reduce((activities, activity) => {
                const date = activity.date.split("T")[0];
                activities[date] = activities[date]
                    ? [...activities[date], activity]
                    : [activity];

                return activities;
            }, {} as { [key: string]: IActivity[] })
        );
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;

        try {
            const activities = await agent.Activities.list();
            runInAction(() => {
                activities.forEach((activity) => {
                    activity.date = activity.date.split(".")[0];
                    this.activityRegistry.set(activity.id, activity);
                });
            });
        } catch (error) {
            runInAction(() => {
                console.log(error);
            });
        } finally {
            runInAction(() => {
                this.loadingInitial = false;
            });
        }
    };

    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;

        try {
            await agent.Activities.create(activity);

            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
            });
        } catch (error) {
            runInAction(() => {
                console.log(error);
            });
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    };

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;

        try {
            await agent.Activities.update(activity);

            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
            });
        } catch (error) {
            runInAction(() => {
                console.log(error);
            });
        } finally {
            runInAction(() => {
                this.submitting = false;
            });
        }
    };

    @action loadActivity = async (id: string) => {
        //undefined if the id doesn`t match anything
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
        } else {
            this.loadingInitial = true;
            runInAction("getting activity", () => {
                this.activity = activity;
                this.loadingInitial = false;
            });

            try {
                activity = await agent.Activities.details(id);
            } catch (error) {
                runInAction("get activity error", () => {
                    this.loadingInitial = false;
                });

                console.log(error);
            }
        }
    };

    @action clearActivity = () => {
        this.activity = undefined;
    };

    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    };

    @action deleteActivity = async (
        event: SyntheticEvent<HTMLButtonElement>,
        id: string
    ) => {
        this.submitting = true;
        this.target = event.currentTarget.name;

        try {
            await agent.Activities.delete(id);

            runInAction("deleting activity", () => {
                this.activityRegistry.delete(id);
            });
        } catch (error) {
            runInAction("delete activity error", () => {
                console.log(error);
            });
        } finally {
            runInAction("delete activty finally", () => {
                this.submitting = false;
                this.target = "";
            });
        }
    };

    @action openCreateForm = () => {
        this.activity = undefined;
    };

    @action openEditForm = (id: string) => {
        this.activity = this.activityRegistry.get(id);
    };
}

export default createContext(new ActivityStore());
