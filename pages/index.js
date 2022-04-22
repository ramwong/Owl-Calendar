import { Component } from 'react';
import Layout from '../components/Layout';
import { getGroups } from '../models/GroupFactory';
import { getGroupName } from '../models/Group';
import { getCalendars } from '../models/CalendarFactory';
import { getCalendarTitle, getEvents } from '../models/Calendar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Body from '../components/Body';
import { Segment } from 'semantic-ui-react';


class CalendarIndex extends Component {

    // default state
    state = {
        selectedGroup: { name: "Select Group", address: "", index: 0 },
        selectedCalendar: { title: "Select Calendar", address: "", index: 0 },
        joinedGroups: [{ text: "loading", value: { index: 0, name: "loading", address: "" } }],
        joinedCalendars: [{ text: "loading", value: { title: "loading", address: "" } }],
        donateVolume: 0,
        events: [
            /*{
                id: 2,
                title: 'DTS STARTS',
                start: new Date(2016, 2, 13, 0, 0, 0),
                end: new Date(2016, 2, 20, 0, 0, 0),
                description: '',
            }*/
        ],
        getGroupsError: { message: "", error: false },
        getCalendarsError: { message: "", error: false },
        getEventsError: { message: "", error: false },
        loading: true,
        update: true
    }

    setSelectedGroup = async (name, address, index) => {
        this.setState({
            selectedGroup: { name: name, address: address, index: index },
            selectedCalendar: { title: "Select Calendar", address: "", }
        });
        await this.refreshJoinedCalendars();
    }

    setSelectedCalendar = async (title, address, index) => {
        const today = new Date();
        const yyyy = today.getFullYear();
        const MM = today.getMonth();
        const monthTimestamp = +new Date(yyyy, MM, 1);
        await this.setState({ selectedCalendar: { title: title, address: address, index: index } });
        await this.refreshEvents(monthTimestamp);
    }

    refreshJoinedGroups = async () => {
        // refresh the error message
        this.setState({ getGroupsError: { message: "", error: false }, loading: true })
        // get joined groups' address
        const getGroupsResult = await getGroups();
        if (getGroupsResult.status) {
            const joinedGroupsAddress = getGroupsResult.result.joinedGroups;
            // get joined groups' name
            const tempJoinedGroups = [];
            for (let i = 0; i < joinedGroupsAddress.length; i++) {
                const address = joinedGroupsAddress[i];
                // get group instance
                const getGroupNameResult = await getGroupName(address);
                if (getGroupNameResult.status) {
                    const groupName = getGroupNameResult.result.groupName;
                    tempJoinedGroups.push({ text: groupName, value: { name: groupName, address: address, index: i } });
                }
            }
            if (tempJoinedGroups) {
                this.setState({ joinedGroups: tempJoinedGroups, loading: false });
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
                const getCalendarNameResult = await getCalendarTitle(address, this.state.selectedGroup.address);
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

    setDonateVolume = (volume) => {
        this.setState({ donateVolume: volume });
    }

    refreshEvents = async (monthTimestamp) => {
        // refresh the error message
        this.setState({ getGroupsError: { message: "", error: false }, loading: true })
        // get Events
        const getEventsResult = await getEvents(this.state.selectedCalendar.address, monthTimestamp, this.state.selectedGroup.address);

        if (getEventsResult.status) {
            const { eventStartTimestamps, eventEndTimestamps, titles,
                descriptions, indexes, } = getEventsResult.result;
            const tempEvents = [];
            for (let i = 0; i < indexes.length; i++) {
                tempEvents.push({
                    id: indexes[i], title: titles[i], start: new Date(+eventStartTimestamps[i]),
                    end: new Date(+eventEndTimestamps[i]), description: descriptions[i]
                });
            }
            this.setState({ events: tempEvents });
            if (this.state.update){
                this.setState({update:false});
            }
        }
    }

    getEvents = () => {
        return this.state.events;
    }

    getSelectedGroup = () => {
        return this.state.selectedGroup;
    }
    getSelectedCalendar = () => {
        return this.state.selectedCalendar;
    }
    getJoinedGroups = () => {
        return this.state.joinedGroups;
    }
    getJoinedCalendars = () => {
        return this.state.joinedCalendars;
    }
    getDonateVolume = () => {
        return this.state.donateVolume;
    }
    render = () => {
        return (
            <Layout>
                <Header
                    setSelectedGroup={this.setSelectedGroup}
                    getSelectedGroup={this.getSelectedGroup}
                    setSelectedCalendar={this.setSelectedCalendar}
                    getSelectedCalendar={this.getSelectedCalendar}
                    getJoinedGroups={this.getJoinedGroups}
                    getJoinedCalendars={this.getJoinedCalendars}
                    refreshJoinedGroups={this.refreshJoinedGroups}
                    refreshJoinedCalendars={this.refreshJoinedCalendars}
                    getDonateVolume={this.getDonateVolume}
                />
                <Body
                    key={this.state.update}
                    getSelectedGroup={this.getSelectedGroup}
                    getSelectedCalendar={this.getSelectedCalendar}
                    getEvents={this.getEvents}
                    refreshEvents={this.refreshEvents}
                />
                <Segment style={{ "verticalAlign": "middle" }}>
                    <Footer floated='bottom'
                        setDonateVolume={this.setDonateVolume}
                    />
                </Segment>
            </Layout >
        );
    }
}

export default CalendarIndex;