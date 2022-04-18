import { Component } from 'react';
import { List, Image, Label, Input } from 'semantic-ui-react';

class Footer extends Component {

    setVolume = (event) => {
        this.props.setDonateVolume(event.target.value);
    }

    rendar() {
        return (
            <div>
                <List horizontal>
                    <List.Item>
                        <Image
                            avatar
                            as='a'
                            size='small'
                            href='https://.........../'
                            target='_blank'
                            src='./images/GitHub-Mark-120px-plus.png' />
                    </List.Item>
                </List>
                <List floated='right' horizontal>
                    <List.Item>
                        <Label>Donate Ether when create Group and Calendar (no limitation):</Label>
                    </List.Item>
                    <List.Item>
                        <Input placeholder='Ether' onChange={setVolume} />
                    </List.Item>
                </List>
            </div>
        )
    }
}
export default Footer;