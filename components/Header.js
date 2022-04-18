import { Component } from 'react';
import { Menu, Dropdown, Button } from 'semantic-ui-react';

class Header extends Component {

    state = {
        selectedGroup: this.props.selectedGroup,
        selectedCalendar: this.props.selectedCalendar,
        joinedGroups: this.props.joinedGroups,
        joinedCalendars: this.props.joinedCalendars,
    }

    refreshState() {
        this.setState({
            selectedGroup: this.props.selectedGroup,
            selectedCalendar: this.props.selectedCalendar,
            joinedGroups: this.props.joinedGroups,
            joinedCalendars: this.props.joinedCalendars,
        });
    }

    componentDidMount = async () => {
        await this.props.refreshJoinedgroups();
        await this.props.refreshJoinedCalendars();
        refreshState();
    }

    handleSelectGroup = async (event, data) => {
        const selectedGroupInfo = data.value;
        await this.props.setSelectedGroup(selectedGroupInfo.name, selectedGroupInfo.address);
        refreshState();
    }

    handleSelectCalendar = async (event, data) => {
        const selectedCalendarInfo = data.value;
        await this.props.setSelectedGroup(selectedCalendarInfo.title, selectedCalendarInfo.address);
        refreshState();
    }

    rendar() {
        return (
            <Menu stackable>
                <Menu.Item header>
                    Owl Calendar
                </Menu.Item>
                <Menu.Menu position="right">
                    <Menu.Item>
                        <Dropdown scrolling id="groupDropdown" text={this.state.selectedGroup.name}
                            options={this.state.joinedGroups} onChange={handleSelectGroup}>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item>
                        <Dropdown scrolling id="calendarDropdown" text={this.state.selectedCalendar.title}
                            options={this.state.joinedCalendars} onChange={handleSelectCalendar}>
                        </Dropdown>
                    </Menu.Item>
                    <Menu.Item>
                        <Button>
                            Manager Group
                        </Button>
                    </Menu.Item>
                    <Menu.Item>
                        <Button>
                            Manager Calendar
                        </Button>
                    </Menu.Item>
                </Menu.Menu>
            </Menu >
        )
    }
}
export default Header;