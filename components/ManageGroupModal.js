import { Component } from 'react';
import { Modal, Button, Input, Grid } from 'semantic-ui-react';
import { createGroup, leaveGroup, addGroup } from '../models/GroupFactory';
import { getGroupInstance } from '../ethereum/instance'
import { addMember, getMembers, updateMember, deleteMember, updateGroupName, changeManager } from '../models/Group';


class ManageGroupModal extends Component {
    state = {
        open: false,
        newGroupName: "",
        newGroupManagerName: "",
        groupAddressToJoin: "",
        selectedGroup:this.props.selectedGroup,
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
    createNewGroup = async () => {
        if (this.state.newGroupName && this.state.newGroupManagerName) {
            this.setState({ open: false });
            await createGroup(this.state.newGroupName, this.state.newGroupManagerName, this.props.donateVolume);
            await this.props.refreshJoinedgroups();
        }
    }
    joinGroup = async () => {
        if (this.state.groupAddressToJoin) {
            this.setState({ open: false });
            await addGroup(this.state.groupAddressToJoin);
            await this.props.refreshJoinedgroups();
        }
    }

    render() {
        return (
            <Modal
                open={this.state.open}
                onClose={() => this.setState({ open: false })}
                onOpen={() => this.setState({ open: true })}
                trigger={<Button>Manage Group</Button>}
            >
                <Modal.Header>Manage Group</Modal.Header>
                <Modal.Content>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={3}>Group Name:</Grid.Column>
                            <Grid.Column width={13}>
                                <Input placeholder='New Group Name' onChange={setNewGroupName} />
                            </Grid.Column>
                            <Grid.Column width={3}>Group Name:</Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={3}>Username:</Grid.Column>
                            <Grid.Column width={13}>
                                <Input placeholder='Your identity' onChange={setNewGroupManagerName} />
                            </Grid.Column>
                            <Grid.Column width={3}>
                                <Button onClick={createNewGroup}>Create</Button>
                            </Grid.Column>
                        </Grid.Row>
                        <Grid.Row>
                            <Grid.Column width={4}>Group Address:</Grid.Column>
                            <Grid.Column width={14}>
                                <Input placeholder='Group you want to join' onChange={setGroupAddressToJoin} />
                            </Grid.Column>
                            <Grid.Column width={4}>
                                <Button onClick={this.joinGroup}>Join</Button>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Modal.Content>
                {
                    this.state.selectedGroup.address ? (
                        <Modal.Content scrolling>

                        </Modal.Content>
                    ) : ("")
                }

            </Modal>
        );
    }
}

export default ManageGroupModal;