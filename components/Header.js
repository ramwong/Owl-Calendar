import { Component } from 'react';
import { Menu, Dropdown, Button } from 'semantic-ui-react';
import ManageGroupModal from './ManageGroupModal';
import ManageCalendarModal from './ManageCalendarModal';
import { getMembers } from '../models/Group';
import { getCooperators } from '../models/Calendar';
class Header extends Component {

    state = {
        selectedGroup: this.props.getSelectedGroup(),
        selectedCalendar: this.props.getSelectedCalendar(),
        joinedGroups: this.props.getJoinedGroups(),
        joinedCalendars: this.props.getJoinedCalendars(),
        groupsOptions: [],
        calendarOptions: [],
        selectedGroupMembers: [],
        selectedCalendarCooperators: [],
    }

    refreshState = async () => {
        this.setState({
            selectedGroup: this.props.getSelectedGroup(),
            selectedCalendar: this.props.getSelectedCalendar(),
            joinedGroups: this.props.getJoinedGroups(),
            joinedCalendars: this.props.getJoinedCalendars(),
        });
        this.getGroupsOptions();
        this.getCalendarsOptions();
    }

    requestSelectedGroupMembers = async () => {
        const results = await getMembers(this.state.selectedGroup.address);
        if (results.status) {
            const result = results["result"];
            const tempSelectedGroupMembers = []
            for (let i = 0; i < result["names"].length; i++) {
                tempSelectedGroupMembers.push({ index: i, address: result["membersAddress"][i], name: result["names"][i], permission: result["permissions"][i] });
            }
            this.setState({ selectedGroupMembers: tempSelectedGroupMembers });
        }
    }

    getSelectedGroupMembers = () => {
        return this.state.selectedGroupMembers;
    }

    requestSelectedCalendarCooperator = async () => {
        const results = await getCooperators(this.state.selectedCalendar.address, this.state.selectedGroup.address);
        if (results.status) {
            const result = results["result"];
            const tempSelectedCalendarCooperators = []
            for (let i = 0; i < result["names"].length; i++) {
                tempSelectedCalendarCooperators.push({ index: i, address: result["cooperatorsAddress"][i], name: result["names"][i], permission: result["permissions"][i] });
            }
            this.setState({ selectedCalendarCooperators: tempSelectedCalendarCooperators });
        }
    }

    getSelectedCalendarCooperators = () => {
        return this.state.selectedCalendarCooperators;
    }

    componentDidMount = async () => {
        await this.props.refreshJoinedGroups();
        await this.props.refreshJoinedCalendars();
        await this.refreshState();
    }

    handleSelectGroup = async (event, data) => {
        const selectedGroupName = data.value;
        for (let group of this.state.joinedGroups) {
            if (group.text == selectedGroupName) {
                await this.props.setSelectedGroup(selectedGroupName, group.value.address, group.value.index);
                break;
            }
        }
        await this.refreshState();
        await this.requestSelectedGroupMembers();
    }

    handleSelectCalendar = async (event, data) => {
        const selectedCalendarTitle = data.value;
        for(let i =0;i<this.state.joinedCalendars.length;i++){
            const calendar = this.state.joinedCalendars[i];
            if (calendar.value.title == selectedCalendarTitle) {
                await this.props.setSelectedCalendar(selectedCalendarTitle, calendar.value.address, i);
                break;
            }
        }
        await this.refreshState();
        await this.requestSelectedCalendarCooperator();
    }

    getGroupsOptions = () => {
        this.setState({
            groupsOptions: this.state.joinedGroups.map(data => { return { text: data.text, value: data.value.name } })
        });
    }
    getCalendarsOptions = () => {
        this.setState({
            calendarOptions: this.state.joinedCalendars.map(data => { return { text: data.text, value: data.value.title } })
        });
    }
    
    render = () => {
        return (
            <Menu stackable style={{ 'marginTop': '0.5em' }}>
                <Menu.Item header>
                    Owl Calendar
                </Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item>
                        <Dropdown scrolling id="groupDropdown" text={this.state.selectedGroup.name}
                            options={this.state.groupsOptions} onChange={this.handleSelectGroup}>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item>
                        <Dropdown scrolling id="calendarDropdown" text={this.state.selectedCalendar.title}
                            options={this.state.calendarOptions} onChange={this.handleSelectCalendar}>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item>
                        <ManageGroupModal
                            refreshJoinedGroups={this.props.refreshJoinedGroups}
                            getDonateVolume={this.props.getDonateVolume}
                            getSelectedGroup={this.props.getSelectedGroup}
                            getSelectedGroupMembers={this.getSelectedGroupMembers}
                            hasSelectedGroup={this.state.selectedGroup.name != "Select Group" ? true : false}
                        />
                    </Menu.Item>
                    <Menu.Item>
                        <ManageCalendarModal
                            refreshJoinedCalendars={this.props.refreshJoinedCalendars}
                            getDonateVolume={this.props.getDonateVolume}
                            getSelectedCalendar={this.props.getSelectedCalendar}
                            getSelectedCalendarCooperators={this.getSelectedCalendarCooperators}
                            hasSelectedCalendar={this.state.selectedCalendar.title != "Select Calendar" ? true : false}
                            getSelectedGroup={this.props.getSelectedGroup}
                        />
                    </Menu.Item>
                </Menu.Menu>
            </Menu >
        )
    }
}
export default Header;