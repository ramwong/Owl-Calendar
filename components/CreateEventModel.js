import { Component, useRef } from 'react';
import { Modal, Button, Input, Grid, Label, Divider, Form, Tab, Container, Table, Dropdown } from 'semantic-ui-react';
import { createGroup, deleteGroup, addGroup } from '../models/GroupFactory';
import { getGroupInstance } from '../ethereum/instance'
import { addMember, getMembers, updateMember, deleteMember, updateGroupName, changeManager } from '../models/Group';

class CreateEventModal extends Component {
    state = {
        event: this.props.getSelectedEvent(),
        open: this.props.open,
    }
    render() {
        console.log("CreateEventModal");
        console.log(this.state.open);
        return;
    }
}

export default CreateEventModal;