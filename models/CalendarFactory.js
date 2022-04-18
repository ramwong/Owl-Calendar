import web3 from '../ethereum/web3';
import Web3 from 'web3';
import { calendarFactory } from '../ethereum/factory';

// helper function
const getAccount = async () => {
    return (await web3.eth.getAccounts())[0];
}


export const createCalendar = async (title, name, donateVolume) => {

    // check not null
    if (title && name) {
        // get selected account
        const account = await getAccount();
        // change donateVolume from ether to wei
        donateVolume = Web3.utils.toWei(donateVolume, 'ether');
        // process create Calendar request
        try {
            await calendarFactory.methods.createCalendar(title, name)
                .send({ from: account, value: donateVolume });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false

}


export const getCalendars = async () => {
    // get selected account
    const account = await getAccount();
    // process get joined calendars request
    try {
        const joinedCalendars = await calendarFactory.methods.getCalendars().call({ from: account });
        return {
            status: true,
            result: { joinedCalendars: joinedCalendars }
        };    // if success, return true
    } catch (ex) {
        return { status: false, reason: ex };   //if not success, return false
    }
};


export const addCalendar = async (calendarAddress) => {

    // check not null
    if (calendarAddress) {
        // get selected account
        const account = await getAccount();
        // process add calendar request
        try {
            await calendarFactory.methods.addCalendar(calendarAddress)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};


export const leaveCalendar = async (index) => {

    // check not null
    if (index) {
        // get selected account
        const account = await getAccount();
        // process leave calendar request
        try {
            await calendarFactory.methods.leaveCalendar(index)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};