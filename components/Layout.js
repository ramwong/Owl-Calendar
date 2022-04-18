import Header from './Header';
import Footer from './Footer';
import { Container, Head } from 'semantic-ui-react';
import { Component } from 'react';

class Layout extends Component {

    render() {
        return (
            <Container>
                <Head>
                    <link rel="stylesheet"
                        href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css" />
                </Head>
                <Header
                    selectedGroup={this.props.selectedGroup}
                    selectedCalendar={this.props.selectedCalendar}
                    joinedGroups={this.props.joinedGroups}
                    joinedCalendars={this.props.joinedCalendars}
                    refreshJoinedgroups={this.props.refreshJoinedgroups}
                    refreshJoinedCalendars={this.props.refreshJoinedCalendars}
                    setSelectedGroup={this.props.setSelectedGroup}
                    setselectedCalendar={this.props.setselectedCalendar}
                />
                {props.children}
                <Footer
                    setDonateVolume={this.props.setDonateVolume}
                />
            </Container>
        )
    }
}

