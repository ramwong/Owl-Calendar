import web3 from '../ethereum/web3';

// helper function
const getAccount = async () => {
    return (await web3.eth.getAccounts())[0];
}

const getPermissionString = (permissionIndex) => {
    const PERMISSION = { 1: "View", 2: "Admin" };
    return PERMISSION[permissionIndex];
}

const getPermissionInt = (permissionString) => {
    const PERMISSION = { "View": 1, "Admin": 2 };
    return PERMISSION[permissionString];
}


export const addMember = async (group, memberAddress, name, permission) => {

    // check not null
    if (group && memberAddress && name && permission) {
        // get selected account
        const account = await getAccount();
        // change permission to number
        permission = getPermissionInt(permission);
        // process add member request
        try {
            await group.methods.addMember(memberAddress, name, permission)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};


export const getMembers = async (group) => {

    // check not null
    if (group) {
        // get selected account
        const account = await getAccount();
        // process get members request
        try {
            const result = await group.methods.getEvents()
                .call({ from: account });
            const permissions = result[1].map(permission => getPermissionString(permission));
            return {
                status: true,
                result: {
                    names: result[0],
                    permissions: permissions,
                }
            };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
}


export const updateMember = async (group, memberAddress, name, permission) => {

    // check not null
    if (group && memberAddress && name && permission) {
        // get selected account
        const account = await getAccount();
        // change permission to number
        permission = getPermissionInt(permission);
        // process update member request
        try {
            await group.methods.updateMember(memberAddress, name, permission)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};


export const deleteMember = async (group, index, memberAddress) => {

    // check not null
    if (group && index && memberAddress) {
        // get selected account
        const account = await getAccount();
        // process remove member request
        try {
            await group.methods.deleteMember(index, memberAddress)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};


export const getGroupName = async (group) => {

    // check not null
    if (group) {
        // get selected account
        const account = await getAccount();
        // process get group name request
        try {
            const result = await group.methods.getGroupName()
                .call({ from: account });
            return {
                status: true,
                result: { groupName: result, }
            };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
}


export const updateGroupName = async (group, name) => {

    // check not null
    if (group && name) {
        // get selected account
        const account = await getAccount();
        // process update group name request
        try {
            await group.methods.updateGroupName(name)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};


export const changeManager = async (group, newManager) => {

    // check not null
    if (group && newManager) {
        // get selected account
        const account = await getAccount();
        // process change manager request
        try {
            await group.methods.changeManager(newManager)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};