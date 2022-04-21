import { Component } from 'react';
import { Modal, Button, Input, Label, Divider, Form, Tab, Container, Table, Dropdown } from 'semantic-ui-react';
import { createCalendar, leaveCalendar, addCalendar } from '../models/CalendarFactory';
import { addCooperator, updateCooperator, deleteCooperator, updateCalendarTitle, changeManager } from '../models/Calendar';

class ManageCalendarModal extends Component {
    state = {
        open: false,
        newCalendarName: "",
        newCalendarManagerName: "",
        calendarAddressToJoin: "",
        selectedCalendar: this.props.getSelectedCalendar(),
        editedCalendarName: this.props.getSelectedCalendar().title,
        newCooperatorName: "",
        newCooperatorAddress: "",
        editedCooperatorName: "",
        joinedCalendarCooperators: this.props.getSelectedCalendarCooperators(),
        editingPermission: {},
        newCooperatorPermission: "View",
    }

    refreshState = async () => {
        this.setState(
            {
                selectedCalendar: this.props.getSelectedCalendar(),
                editedCalendarName: this.props.getSelectedCalendar().title,
                joinedCalendarCooperators: this.props.getSelectedCalendarCooperators(),
            }
        )
    }

    setNewCalendarName = (event) => {
        this.setState({ newCalendarName: event.target.value });
    }
    setNewCalendarManagerName = (event) => {
        this.setState({ newCalendarManagerName: event.target.value });
    }
    setCalendarAddressToJoin = (event) => {
        this.setState({ calendarAddressToJoin: event.target.value });
    }
    setEditedCalendarName = (event) => {
        this.setState({ editedCalendarName: event.target.value });
    }
    setNewCooperatorName = (event) => {
        this.setState({ newCooperatorName: event.target.value })
    }
    setNewCooperatorAddress = (event) => {
        this.setState({ newCooperatorAddress: event.target.value })
    }
    setEditedCooperator = (event) => {
        this.setState({ editedCooperatorName: event.target.value })
    }
    setNewCooperatorPermission = (event, data) => {
        this.setState({ newCooperatorPermission: data.value })

    }


    createNewCalendar = async () => {
        if (this.state.newCalendarName && this.state.newCalendarManagerName) {
            this.setState({ open: false });
            await createCalendar(this.state.newCalendarName, this.state.newCalendarManagerName, this.props.getDonateVolume() || 0);
            await this.props.refreshJoinedCalendars();
        }
    }
    joinCalendar = async () => {
        if (this.state.calendarAddressToJoin) {
            this.setState({ open: false });
            await addCalendar(this.state.calendarAddressToJoin);
            await this.props.refreshJoinedCalendars();
        }
    }
    editCalendarName = async () => {
        if (this.state.editedCalendarName) {
            this.setState({ open: false });
            const result = await updateCalendarTitle(this.state.selectedCalendar.address, this.state.editedCalendarName, this.props.getSelectedGroup().address);
            console.log(result);
            await this.props.refreshJoinedCalendars();
        }
    }
    leaveCalendar = async () => {
        this.setState({ open: false });
        const result = await leaveCalendar(this.state.selectedCalendar.index);

        await this.props.refreshJoinedCalendars();
    }
    addNewCooperator = async () => {
        console.log(this.state.newCooperatorName)
        console.log(this.state.newCooperatorAddress)
        if (this.state.newCooperatorName && this.state.newCooperatorAddress) {
            const result = await addCooperator(this.state.selectedCalendar.address, this.state.newCooperatorAddress, this.state.newCooperatorPermission, this.state.newCooperatorName, this.props.getSelectedGroup().address);
            console.log(result)
            await this.props.getSelectedCalendarCooperators();
        }
    }
    updateCooperatorName = async (event, address) => {
        const newName = event.target.cooperatorName.value;
        const newPermission = this.state.editingPermission[address];
        console.log(newName);
        console.log(newPermission);
        if (newName && newPermission) {
            await updateCooperator(this.state.selectedCalendar.address, address, newName, newPermission, this.props.getSelectedGroup().address);
            await this.props.getSelectedCalendarCooperators();
        }
    }
    removeCooperator = async (i, address) => {
        await deleteCooperator(this.state.selectedCalendar.address, i, address);
        await this.props.getSelectedCalendarCooperators();
    }

    transferManager = async (address) => {
        await changeManager(this.state.selectedCalendar.address, address);
    }

    componentDidMount = async () => {
        if (this.state.selectedCalendar.title != "Select Calendar") {
            await this.props.getSelectedCalendarCooperators()
        }
    }

    createTap = () => {
        return {
            menuItem: 'Create', render: () => {
                return (
                    <Form style={{ paddingTop: "1em" }}>
                        <Form.Field widths='equal'>
                            <Label size="large">Calendar Name:</Label>
                            <Input placeholder='New Calendar Name' onChange={this.setNewCalendarName} />
                        </Form.Field>
                        <Form.Field>
                            <Label size="large">Username:</Label>
                            <Input placeholder='Your identity' onChange={this.setNewCalendarManagerName} />
                        </Form.Field>
                        <Form.Field>
                            <Button onClick={this.createNewCalendar}>Create</Button>
                        </Form.Field>
                    </Form>
                );
            }
        }
    }
    joinTap = () => {
        return {
            menuItem: 'Join', render: () => {
                return (
                    <Form style={{ paddingTop: "1em" }}>
                        <Form.Field>
                            <Label size="large">Calendar Address:</Label>
                            <Input placeholder='Calendar you want to join' onChange={this.setCalendarAddressToJoin} />
                        </Form.Field>
                        <Form.Field>
                            <Button onClick={this.joinCalendar}>Join</Button>
                        </Form.Field>
                    </Form>
                );
            }
        }
    }

    selectedCalendarTap = () => {
        return {
            menuItem: this.state.selectedCalendar.title, render: () => {
                return (
                    <Container>
                        <Form style={{ paddingTop: "1em" }}>
                            <Form.Field>
                                <Label size="large">Calendar Name (Address: {this.state.selectedCalendar.address}):</Label>
                                <Input placeholder='Name you would like to change to' onChange={this.setEditedCalendarName} value={this.state.editedCalendarName} />
                            </Form.Field>
                            <Form.Field>
                                <Button onClick={this.editCalendarName}>Edit</Button>
                                <Button onClick={this.leaveCalendar}>Leave</Button>
                            </Form.Field>
                        </Form>

                        <Divider />

                        <Form>
                            <Form.Field>
                                <Label size="large">Cooperator Name:</Label>
                                <Input placeholder='New Cooperator Name' onChange={this.setNewCooperatorName} />
                            </Form.Field>
                            <Form.Field>
                                <Label size="large">Cooperator Address:</Label>
                                <Input placeholder='New Cooperator Address' onChange={this.setNewCooperatorAddress} />
                            </Form.Field>
                            <Form.Field>
                                <Dropdown style={{ marginLeft: "1em" }}
                                    onChange={this.setNewCooperatorPermission}
                                    options={[{ text: "View", value: "View" }, { text: "Admin", value: "Admin" }]}
                                    defaultValue={"View"} />
                            </Form.Field>
                            <Form.Field>
                                <Button onClick={this.addNewCooperator}>Add</Button>
                            </Form.Field>
                        </Form>

                        <Divider />
                        <Table padded>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell >Address</Table.HeaderCell>
                                    <Table.HeaderCell >Name and Permission</Table.HeaderCell>
                                    <Table.HeaderCell >Actions</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.joinedCalendarCooperators.map((cooperator, i) => {
                                    return (
                                        <Table.Row key={i}>
                                            <Table.HeaderCell>{cooperator.address}</Table.HeaderCell>
                                            <Table.HeaderCell >
                                                <Form onSubmit={(event) => { this.updateCooperatorName(event, cooperator.address) }}>
                                                    <Input name="cooperatorName" defaultValue={cooperator.name} />
                                                    <Dropdown style={{ marginLeft: "1em" }}
                                                        onChange={(event, data) => {
                                                            const addressPermission = {};
                                                            addressPermission[cooperator.address] = data.value;
                                                            this.setState({
                                                                editingPermission: { ...(this.state.editingPermission), ...(addressPermission) }
                                                            })
                                                        }}
                                                        options={[{ text: "View", value: "View" }, { text: "Admin", value: "Admin" }]}
                                                        defaultValue={cooperator.permission} />
                                                    <Button type="submit">Edit</Button>
                                                </Form>
                                            </Table.HeaderCell>
                                            <Table.HeaderCell >
                                                <Button onClick={(event) => { this.removeCooperator(i, cooperator.address) }}>Remove</Button>
                                                <Button onClick={(event) => { this.transferManager(cooperator.address) }}>Transfer</Button>
                                            </Table.HeaderCell>
                                        </Table.Row>
                                    );
                                })}
                            </Table.Body>
                        </Table>
                    </Container>
                );
            }

        }
    }

    render() {
        return (
            <Modal
                style={{ top: "15%" }}
                open={this.state.open}
                size="large"
                onClose={() => this.setState({ open: false })}
                onOpen={() => { this.refreshState(); this.setState({ open: true }) }}
                trigger={<Button>Manage Calendar</Button>}
            >
                <Modal.Header>Manage Calendar</Modal.Header>
                <Modal.Content scrolling>
                    {this.props.hasSelectedCalendar ?
                        <Tab panes={[this.createTap(), this.joinTap(), this.selectedCalendarTap()]} />
                        :
                        <Tab panes={[this.createTap(), this.joinTap()]} />
                    }
                </Modal.Content>

            </Modal>
        );
    }
}

export default ManageCalendarModal;