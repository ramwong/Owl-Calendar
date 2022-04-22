import { Component, } from 'react';
import { Modal, Button, Input, Label, Divider, Form, Tab, Container, Table, Dropdown } from 'semantic-ui-react';
import { createGroup, deleteGroup, addGroup } from '../models/GroupFactory';
import { addMember, updateMember, deleteMember, updateGroupName, changeManager } from '../models/Group';

class ManageGroupModal extends Component {
    state = {
        open: false,
        newGroupName: "",
        newGroupManagerName: "",
        groupAddressToJoin: "",
        selectedGroup: this.props.getSelectedGroup(),
        editedGroupName: this.props.getSelectedGroup().name,
        newMemberName: "",
        newMemberAddress: "",
        editedMemberName: "",
        joinedGroupMembers: this.props.getSelectedGroupMembers(),
        editingPermission: {},
        newMemberPermission: "View",
        loading: false,
    }

    doLoading = async (func) => {
        this.setState({ loading: true });
        try {
            await func()
            window.alert('Transaction Success, refreshing the web page')
            location.reload()
        }catch(err){
            window.alert('Transaction Failed: '+err?.message ?? err)
        }finally{
            this.setState({ loading: false });
        }
        
        
    }

    refreshState = async () => {
        this.setState(
            {
                selectedGroup: this.props.getSelectedGroup(),
                editedGroupName: this.props.getSelectedGroup().name,
                joinedGroupMembers: this.props.getSelectedGroupMembers(),
            }
        )
    }

    setNewGroupName = (event) => {
        this.setState({ newGroupName: event.target.value });
    }
    setNewGroupManagerName = (event) => {
        this.setState({ newGroupManagerName: event.target.value });
    }
    setGroupAddressToJoin = (event) => {
        this.setState({ groupAddressToJoin: event.target.value });
    }
    setEditedGroupName = (event) => {
        this.setState({ editedGroupName: event.target.value });
    }
    setNewMemberName = (event) => {
        this.setState({ newMemberName: event.target.value })
    }
    setNewMemberAddress = (event) => {
        this.setState({ newMemberAddress: event.target.value })
    }
    setEditedMember = (event) => {
        this.setState({ editedMemberName: event.target.value })
    }
    setNewMemberPermission = (event, data) => {
        this.setState({ newMemberPermission: data.value })

    }


    createNewGroup = async () => {
        //console.log("123" + this.props.donateVolume);
        if (this.state.newGroupName && this.state.newGroupManagerName) {
            await this.doLoading(async () => {
                await createGroup(this.state.newGroupName, this.state.newGroupManagerName, this.props.getDonateVolume() || 0);
                await this.props.refreshJoinedGroups();
                this.setState({ open: false });
            })
        }
    }
    joinGroup = async () => {
        if (this.state.groupAddressToJoin) {

            await this.doLoading(async () => {
                await addGroup(this.state.groupAddressToJoin);
                await this.props.refreshJoinedGroups();
                this.setState({ open: false });
            })
        }
    }
    editGroupName = async () => {
        if (this.state.editedGroupName) {
            await this.doLoading(async () => {
                const result = await updateGroupName(this.state.selectedGroup.address, this.state.editedGroupName);
                console.log(result);
                await this.props.refreshJoinedGroups();
                this.setState({ open: false });
            })
        }
    }
    leaveGroup = async () => {
        await this.doLoading(async () => {
            const result = await deleteGroup(this.state.selectedGroup.index);
            await this.props.refreshJoinedGroups();
            this.setState({ open: false });
        })
    }
    addNewMember = async () => {
        console.log(this.state.newMemberName);
        console.log(this.state.newMemberAddress);
        if (this.state.newMemberName && this.state.newMemberAddress) {
            await this.doLoading(async () => {
                await addMember(this.state.selectedGroup.address, this.state.newMemberAddress, this.state.newMemberName, this.state.newMemberPermission);
                await this.props.getSelectedGroupMembers();
            })
        }

    }

    updateMemberName = async (event, address) => {
        const newName = event.target.memberName.value;
        const newPermission = this.state.editingPermission[address];
        console.log(newName);
        console.log(this.state.editingPermission);
        if (newName && newPermission) {
            await this.doLoading(async () => {
                await updateMember(this.state.selectedGroup.address, address, newName, newPermission);
                await this.props.getSelectedGroupMembers();
            })
        }
    }
    removeMember = async (i, address) => {
        await this.doLoading(async () => {
            await deleteMember(this.state.selectedGroup.address, i, address);
            await this.props.getSelectedGroupMembers();
        })
    }

    transferManager = async (address) => {
        await this.doLoading(async () => await changeManager(this.state.selectedGroup.address, address))
    }

    componentDidMount = async () => {
        if (this.state.selectedGroup.name != "Select Group") {
            await this.doLoading(async () => await this.props.getSelectedGroupMembers())
        }
    }

    createTap = () => {
        return {
            menuItem: 'Create', render: () => {
                return (
                    <Form style={{ paddingTop: "1em" }}>
                        <Form.Field widths='equal'>
                            <Label size="large">Group Name:</Label>
                            <Input placeholder='New Group Name' onChange={this.setNewGroupName} />
                        </Form.Field>
                        <Form.Field>
                            <Label size="large">Username:</Label>
                            <Input placeholder='Your identity' onChange={this.setNewGroupManagerName} />
                        </Form.Field>
                        <Form.Field>
                            <Button onClick={this.createNewGroup} loading={this.state.loading} disabled={this.state.loading}>Create</Button>
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
                            <Label size="large">Group Address:</Label>
                            <Input placeholder='Group you want to join' onChange={this.setGroupAddressToJoin} />
                        </Form.Field>
                        <Form.Field>
                            <Button onClick={this.joinGroup} loading={this.state.loading} disabled={this.state.loading}>Join</Button>
                        </Form.Field>
                    </Form>
                );
            }
        }
    }

    selectedGroupTap = () => {
        //console.log(this.state.joinedGroupMembers);
        return {
            menuItem: this.state.selectedGroup.name, render: () => {
                return (
                    <Container>
                        <Form style={{ paddingTop: "1em" }}>
                            <Form.Field>
                                <Label size="large">Group Name (Address: {this.state.selectedGroup.address}):</Label>
                                <Input placeholder='Name you would like to change to' onChange={this.setEditedGroupName} value={this.state.editedGroupName} />
                            </Form.Field>
                            <Form.Field>
                                <Button onClick={this.editGroupName} loading={this.state.loading} disabled={this.state.loading}>Edit</Button>
                                <Button onClick={this.leaveGroup} loading={this.state.loading} disabled={this.state.loading}>Leave</Button>
                            </Form.Field>
                        </Form>

                        <Divider />

                        <Form>
                            <Form.Field>
                                <Label size="large">Member Name:</Label>
                                <Input placeholder='New Member Name' onChange={this.setNewMemberName} />
                            </Form.Field>
                            <Form.Field>
                                <Label size="large">Member Address:</Label>
                                <Input placeholder='New Member Address' onChange={this.setNewMemberAddress} />
                            </Form.Field>
                            <Form.Field>
                                <Dropdown style={{ marginLeft: "1em" }}
                                    onChange={this.setNewMemberPermission}
                                    options={[{ text: "View", value: "View" }, { text: "Admin", value: "Admin" }]}
                                    defaultValue={"View"} />
                            </Form.Field>
                            <Form.Field>
                                <Button onClick={this.addNewMember} loading={this.state.loading} disabled={this.state.loading}>Add</Button>
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
                                {this.state.joinedGroupMembers.map((member, i) => {
                                    return (
                                        <Table.Row key={i}>
                                            <Table.HeaderCell>{member.address}</Table.HeaderCell>
                                            <Table.HeaderCell >
                                                <Form onSubmit={(event) => { this.updateMemberName(event, member.address) }}>
                                                    <Input name="memberName" defaultValue={member.name} />
                                                    <Dropdown style={{ marginLeft: "1em" }}
                                                        onChange={(event, data) => {
                                                            const addressPermission = {};
                                                            addressPermission[member.address] = data.value;
                                                            this.setState({
                                                                editingPermission: { ...(this.state.editingPermission), ...(addressPermission) }
                                                            })
                                                        }}
                                                        options={[{ text: "View", value: "View" }, { text: "Admin", value: "Admin" }]}
                                                        defaultValue={member.permission} />
                                                    <Button loading={this.state.loading} disabled={this.state.loading} type="submit">Edit</Button>
                                                </Form>
                                            </Table.HeaderCell>
                                            <Table.HeaderCell >
                                                <Button loading={this.state.loading} disabled={this.state.loading} onClick={(event) => { this.removeMember(i, member.address) }}>Remove</Button>
                                                <Button loading={this.state.loading} disabled={this.state.loading} onClick={(event) => { this.transferManager(member.address) }}>Transfer</Button>
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
                trigger={<Button>Manage Group</Button>}
            >
                <Modal.Header>Manage Group</Modal.Header>
                <Modal.Content scrolling>
                    {this.props.hasSelectedGroup ?
                        <Tab panes={[this.createTap(), this.joinTap(), this.selectedGroupTap()]} />
                        :
                        <Tab panes={[this.createTap(), this.joinTap()]} />
                    }
                </Modal.Content>

            </Modal>
        );
    }
}

export default ManageGroupModal;