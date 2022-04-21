import web3 from '../ethereum/web3';
import Web3 from 'web3';
import { groupFactory } from '../ethereum/factory';

// helper function
const getAccount = async () => {
    return (await web3.eth.getAccounts())[0];
}


export const createGroup = async (gname, mname, donateVolume) => {

    // check not null
    if (gname && mname) {
        // get selected account
        const account = await getAccount();
        // change donateVolume from ether to wei
        donateVolume = Web3.utils.toWei("" + donateVolume, 'ether');
        // process create Group request
        try {
            await groupFactory.methods.createGroup(gname, mname)
                .send({ from: account, value: donateVolume });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false

}


export const getGroups = async () => {
    // get selected account
    const account = await getAccount();
    // process get joined Groups request
    try {
        const joinedGroups = await groupFactory.methods.getGroups().call({ from: account });
        return {
            status: true,
            result: { joinedGroups: joinedGroups }
        };    // if success, return true
    } catch (ex) {
        return { status: false, reason: ex };   //if not success, return false
    }
};


export const addGroup = async (groupAddress) => {

    // check not null
    if (groupAddress) {
        // get selected account
        const account = await getAccount();
        // process add Group request
        try {
            await groupFactory.methods.addGroup(groupAddress)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};


export const deleteGroup = async (index) => {

    // get selected account
    const account = await getAccount();
    // process leave Group request
    try {
        await groupFactory.methods.leaveGroup(index)
            .send({ from: account });
        return { status: true };    // if success, return true
    } catch (ex) {
        return { status: false, reason: ex };   //if not success, return false
    }

};