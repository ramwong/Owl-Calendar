import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Component } from 'react';
import { Container, Modal, Label, Input, TextArea, Button } from 'semantic-ui-react';
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import { addEvent, updateEvent, deleteEvent } from '../models/Calendar';

class Body extends Component {
    state = {
        events: this.props.getEvents(),
        isCreateEventModalOpen: false,
        createEventModalSetOpen: "",
        newEventStart: new Date(),
        newEventEnd: new Date(),
        newEventTitle: "",
        newEventDescription: "",
        selectedEventStart: new Date(),
        selectedEventEnd: new Date(),
        selectedEventTitle: "",
        selectedEventDescription: "",
        selectedEventId: 0,
        isManageEventModalOpen: false,
        loading: false,
    }

    doLoading = async (func) => {

        if (this.props.getSelectedCalendar().address === ''){
            window.alert('please select a calendar first')
        }

        this.setState({ loading: true });
        try {
            const res = await func()
            if (res?.status ?? true) {
                window.alert('Transaction Success')
            }else{
                window.alert('Transaction Failed')
            }
        } catch (err) {
            window.alert('Transaction Failed: ' + err?.message ?? err)
        } finally {
            this.setState({ loading: false });
        }

    }

    handleSelectEvent = (event) => {
        this.setState({
            selectedEventStart: event.start,
            selectedEventEnd: event.end,
            selectedEventTitle: event.title,
            selectedEventDescription: event.description,
            isManageEventModalOpen: true,
            selectedEventId: +event.id,
        })
    }

    handleSelectSlot = (event) => {
        this.setState({ isCreateEventModalOpen: true, newEventStart: event.start, newEventEnd: event.end });
    }

    setIsCreateEventModalOpen = (bool, createEventModalSetOpen) => {
        this.setState({ isCreateEventModalOpen: bool, createEventModalSetOpen: createEventModalSetOpen });
    }

    getIsCreateEventModalOpen = () => {
        return this.state.isCreateEventModalOpen;
    }
    getSelectedEvent = () => {
        return this.state.selectedEvent;
    }

    createNewEvent = async () => {
        await this.doLoading(async () => {
            const MM = this.state.newEventStart.getMonth();
            const YYYY = this.state.newEventStart.getFullYear();
            const monthTimestamp = +new Date(YYYY, MM, 1);
            const result = await addEvent(this.props.getSelectedCalendar().address, monthTimestamp,
                +this.state.newEventStart, +this.state.newEventEnd, this.state.newEventTitle,
                this.state.newEventDescription, this.props.getSelectedGroup().address);
            await this.props.refreshEvents(monthTimestamp);
            this.setState({ events: this.props.getEvents(), isManageEventModalOpen: false });
            return result
        })
    }
    componentDidMount = async () => {
        await this.setState({ events: this.props.getEvents(), })
    }

    updateSelectedEvent = async () => {
        await this.doLoading(async () => {
            const MM = this.state.selectedEventStart.getMonth();
            const YYYY = this.state.selectedEventStart.getFullYear();
            const monthTimestamp = +new Date(YYYY, MM, 1);
            const result = await updateEvent(this.props.getSelectedCalendar().address, monthTimestamp, this.state.selectedEventId,
                +this.state.selectedEventStart, +this.state.selectedEventEnd,
                this.state.selectedEventTitle, this.state.selectedEventDescription, this.props.getSelectedGroup().address);
            await this.props.refreshEvents(monthTimestamp);
            this.setState({ events: this.props.getEvents(), isManageEventModalOpen: false });
            return result
        })
    }

    removeSelectedEvent = async () => {
        await this.doLoading(async () => {
            const MM = this.state.selectedEventStart.getMonth();
            const YYYY = this.state.selectedEventStart.getFullYear();
            const monthTimestamp = +new Date(YYYY, MM, 1);
            const result = await deleteEvent(this.props.getSelectedCalendar().address, monthTimestamp,
                this.state.selectedEventId, this.props.getSelectedGroup.address);
            await this.props.refreshEvents(monthTimestamp);
            this.setState({ events: this.props.getEvents(), isManageEventModalOpen: false });
            return result
        })
    }

    render = () => {
        const localizer = momentLocalizer(moment);
        return (
            <Container className="myCustomHeight" style={{ height: "60em" }}>
                <Calendar
                    localizer={localizer}
                    events={this.state.events}
                    startAccessor="start"
                    endAccessor="end"
                    onSelectEvent={this.handleSelectEvent}
                    onSelectSlot={this.handleSelectSlot}
                    selectable
                />
                <Modal
                    style={{ top: "15%" }}
                    size="large"
                    onClose={() => { this.setState({ isCreateEventModalOpen: false }) }}
                    onOpen={() => { this.setState({ isCreateEventModalOpen: true }) }}
                    open={this.state.isCreateEventModalOpen}
                    toggle={this.handleSelectSlot}
                >
                    <Modal.Header>Create New Event</Modal.Header>
                    <Modal.Content>
                        <Container>
                            <Label size="large">Start:</Label>
                            <DateTimePicker onChange={(value) => this.setState({ newEventStart: value })} value={this.state.newEventStart} />
                            <Label size="large">End:</Label>
                            <DateTimePicker onChange={(value) => this.setState({ newEventEnd: value })} value={this.state.newEventEnd} />
                            <br />
                            <Label size="large" style={{ marginTop: "1em" }}>Title</Label>
                            <Input onChange={(event) => { this.setState({ newEventTitle: event.target.value }) }} />
                            <br />
                            <Label size="large" style={{ marginTop: "1em" }}>Description</Label><br />
                            <TextArea onChange={(event) => { this.setState({ newEventDescription: event.target.value }) }} />
                            <br />
                            <Button onClick={this.createNewEvent} loading={this.state.loading} disabled={this.state.loading}>
                                Create
                            </Button>
                        </Container>
                    </Modal.Content>
                </Modal>

                <Modal
                    style={{ top: "15%" }}
                    size="large"
                    onClose={() => { this.setState({ isManageEventModalOpen: false }) }}
                    onOpen={() => { this.setState({ isManageEventModalOpen: true }) }}
                    open={this.state.isManageEventModalOpen}
                    toggle={this.handleSelectEvent}
                >
                    <Modal.Header>Manage {this.state.selectedEventTitle}</Modal.Header>
                    <Modal.Content>
                        <Container>
                            <Label size="large">Start:</Label>
                            <DateTimePicker onChange={(event) => this.setState({ selectedEventStart: value })} value={this.state.selectedEventStart} />
                            <Label size="large">End:</Label>
                            <DateTimePicker onChange={() => this.setState({ selectedEventEnd: value })} value={this.state.selectedEventEnd} />
                            <br />
                            <Label size="large" style={{ marginTop: "1em" }}>Title</Label>
                            <Input onChange={(event) => { this.setState({ selectedEventTitle: event.target.value }) }} value={this.state.selectedEventTitle} />
                            <br />
                            <Label size="large" style={{ marginTop: "1em" }}>Description</Label><br />
                            <TextArea onChange={(event) => { this.setState({ selectedEventDescription: event.target.value }) }} value={this.state.selectedEventDescription} />
                            <br />
                            <Button onClick={this.updateSelectedEvent}  loading={this.state.loading} disabled={this.state.loading}>
                                Update
                            </Button>
                            <Button onClick={this.removeSelectedEvent}  loading={this.state.loading} disabled={this.state.loading}>
                                Remove
                            </Button>
                        </Container>
                    </Modal.Content>
                </Modal>

            </Container>
        );
    }
}
export default Body;