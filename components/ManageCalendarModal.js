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
        loading: false,
    }

    doLoading = async (func) => {
        this.setState({ loading: true });
        try {
            const res = await func()
            if (res?.status ?? true) {
                window.alert('Transaction Success, refreshing the web page')
                location.reload()
            }else{
                window.alert('Transaction Failed')
            }
        } catch (err) {
            window.alert('Transaction Failed: ' + err?.message ?? err)
        } finally {
            this.setState({ loading: false });
        }
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
            await this.doLoading(async () => {
                const result = await createCalendar(this.state.newCalendarName, this.state.newCalendarManagerName, this.props.getDonateVolume() || 0);
                await this.props.refreshJoinedCalendars();
                this.setState({ open: false });
                return result
            })


        }
    }
    joinCalendar = async () => {
        if (this.state.calendarAddressToJoin) {
            await this.doLoading(async () => {
                const result = await addCalendar(this.state.calendarAddressToJoin);
                await this.props.refreshJoinedCalendars();
                this.setState({ open: false });
                return result
            })


        }
    }
    editCalendarName = async () => {
        if (this.state.editedCalendarName) {
            await this.doLoading(async () => {
                const result = await updateCalendarTitle(this.state.selectedCalendar.address, this.state.editedCalendarName, this.props.getSelectedGroup().address);
                await this.props.refreshJoinedCalendars();
                this.setState({ open: false });
                return result
            })
        }
    }
    leaveCalendar = async () => {
        await this.doLoading(async () => {
            const result = await leaveCalendar(this.state.selectedCalendar.index);
            await this.props.refreshJoinedCalendars();
            this.setState({ open: false });
            return result
        })
        
    }
    addNewCooperator = async () => {
        if (this.state.newCooperatorName && this.state.newCooperatorAddress) {
            await this.doLoading(async () => {
                const result = await addCooperator(this.state.selectedCalendar.address, this.state.newCooperatorAddress, this.state.newCooperatorPermission, this.state.newCooperatorName, this.props.getSelectedGroup().address);
                await this.props.getSelectedCalendarCooperators();
                return result
            })
            
        }
    }
    updateCooperatorName = async (event, address) => {
        const newName = event.target.cooperatorName.value;
        const newPermission = this.state.editingPermission[address];
        if (newName && newPermission) {
            await this.doLoading(async () => {
                const res = await updateCooperator(this.state.selectedCalendar.address, address, newName, newPermission, this.props.getSelectedGroup().address);
                await this.props.getSelectedCalendarCooperators();
                return res
            })
            
        }
    }
    removeCooperator = async (i, address) => {
        await this.doLoading(async () => {
            const res = await deleteCooperator(this.state.selectedCalendar.address, i, address);
            await this.props.getSelectedCalendarCooperators();
            return res
        })
        
    }

    transferManager = async (address) => {
        await this.doLoading(async () => {
            return await changeManager(this.state.selectedCalendar.address, address);
        })
        
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
                            <Button onClick={this.createNewCalendar} loading={this.state.loading} disabled={this.state.loading}>Create</Button>
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
                            <Button onClick={this.joinCalendar} loading={this.state.loading} disabled={this.state.loading}>Join</Button>
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
                                <Button onClick={this.editCalendarName} loading={this.state.loading} disabled={this.state.loading}>Edit</Button>
                                <Button onClick={this.leaveCalendar} loading={this.state.loading} disabled={this.state.loading}>Leave</Button>
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
                                <Button onClick={this.addNewCooperator} loading={this.state.loading} disabled={this.state.loading}>Add</Button>
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
                                                    <Button type="submit" loading={this.state.loading} disabled={this.state.loading}>Edit</Button>
                                                </Form>
                                            </Table.HeaderCell>
                                            <Table.HeaderCell >
                                                <Button onClick={(event) => { this.removeCooperator(i, cooperator.address) }} loading={this.state.loading} disabled={this.state.loading}>Remove</Button>
                                                <Button onClick={(event) => { this.transferManager(cooperator.address) }} loading={this.state.loading} disabled={this.state.loading}>Transfer</Button>
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