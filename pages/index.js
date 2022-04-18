import { Component } from 'react';
import { getCalendarInstance, getGroupInstance } from '../ethereum/instance';
import Layout from '../components/Layout';
import { getGroups } from '../models/GroupFactory';
import { getGroupName } from '../models/Group';
import { getCalendars } from '../models/CalendarFactory';
import { getCalendarTitle, getEvents } from '../models/Calendar';


class CalendarIndex extends Component {

    // default state
    state = {
        selectedGroup: { name: "Select Group", address: "", },
        selectedCalendar: { title: "Select Calendar", address: "", },
        joinedGroups: [{ text: "loading", value: { name: "loading", address: "" }, disable: true }],
        joinedCalendars: [{ text: "loading", value: { title: "loading", address: "" }, disable: true }],
        donateVolume: 0,
        events: {
            /* 'dd-MM-yyyy': [ //new Date().getDate(), getMonth()+1, getFullYear()
                {
                    id: index,
                    startAt: new Date(eventStartTimestamp).toISOString(),
                    endAt: new Date(eventEndTimestamp).toISOString(),
                    summary: description,
                    color: color
                }
            ] */
        },
        getGroupsError: { message: "", error: false },
        getCalendarsError: { message: "", error: false },
        getEventsError: { message: "", error: false },
        loading: true,
    }

    setSelectedGroup = async (name, address) => {
        await refreshJoinedCalendars();
        this.setState({
            selectedGroup: { name: name, address: address },
            selectedCalendar: { title: "Select Calendar", address: "", }
        });
    }

    setselectedCalendar = async (title, address) => {
        //refreshEvents
        const today = new Date();
        const yyyy = today.getFullYear();
        const MM = today.getMonth() + 1;
        const dd = today.getDate();
        const dateString = `${MM}/${dd}/${yyyy}`;
        const monthTimestamp = new Date(dateString).getTime();
        await refreshEvents(monthTimestamp);
        this.setState({ selectedCalendar: { title: title, address: address } });
    }

    refreshJoinedgroups = async () => {
        // refresh the error message
        this.setState({ getGroupsError: { message: "", error: false }, loading: true })
        // get joined groups' address
        const getGroupsResult = await getGroups();
        if (getGroupsResult.status) {
            const joinedGroupsAddress = getGroupsResult.result.joinedGroups;
            // get joined groups' name
            const joinedGroups = [];
            for (const address of joinedGroupsAddress) {
                // get group instance
                const group = getGroupInstance(address);
                const getGroupNameResult = await getGroupName(group);
                if (getGroupNameResult.status) {
                    const groupName = getGroupNameResult.result.groupName;
                    joinedGroups.push({ text: groupName, value: { name: groupName, address: address } });
                }
            }
            if (joinedGroups) {
                this.setState({ joinedGroups: joinedGroups, loading: false });
            } else {
                this.setState({ getGroupsError: { message: "Cannot get groups' name", error: true } });
            }
        } else {
            this.setState({ getGroupsError: { message: getGroupsResult.reason, error: true } });
        }
    }

    refreshJoinedCalendars = async () => {
        // refresh the error message
        this.setState({ getCalendarsError: { message: "", error: false }, loading: true })
        // get joined calendars' address
        const getCalendarsResult = await getCalendars();
        if (getCalendarsResult.status) {
            const joinedCalendarsAddress = getCalendarsResult.result.joinedCalendars;
            // get joined calendars' name
            const joinedCalendars = [];
            for (const address of joinedCalendarsAddress) {
                // get calendar instance
                const calendar = getCalendarInstance(address);
                const getCalendarNameResult = await getCalendarTitle(calendar, this.state.selectedGroup.address);
                if (getCalendarNameResult.status) {
                    const calendarTitle = getCalendarNameResult.result.calendarTitle;
                    joinedCalendars.push({ text: calendarTitle, value: { title: calendarTitle, address: address } });
                }
            }
            if (joinedCalendars) {
                this.setState({ joinedCalendars: joinedCalendars, loading: false });
            } else {
                this.setState({ getCalendarsError: { message: "Cannot get calendars' name", error: true } });
            }
        } else {
            this.setState({ getCalendarsError: { message: getCalendarsResult.reason, error: true } });
        }
    }

    setDonateVolume(volume) {
        this.setState({ donateVolume: volume });
    }

    refreshEvents = async (monthTimestamp) => {
        // refresh the error message
        this.setState({ getGroupsError: { message: "", error: false }, loading: true })
        // get calendar instance
        const calendar = getCalendarInstance(this.state.selectedCalendar.address);
        // get Events
        const getEventsResult = await getEvents(calendar, this.state.selectedGroup.address);
        if (getCalendarNameResult.status) {
            const { eventStartTimestamps, eventEndTimestamps, titles,
                descriptions, colors, createdBys, indexes, } = getCalendarNameResult.result;
        }
    }

    render() {
        return (
            <Layout state>
                <div>
                    loading
                </div>
            </Layout>
        );
    }
}

export default CalendarIndex;