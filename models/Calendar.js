import web3 from '../ethereum/web3';

// helper function
const getAccount = async () => {
    return (await web3.eth.getAccounts())[0];
}

const createCooperatorAddress = (selectedGroupAddress) => {
    const cooperatorAddress = [];
    if (selectedGroupAddress) {
        cooperatorAddress.push(selectedGroupAddress);
    }
    cooperatorAddress.push(account);
    return cooperatorAddress;
}

const getPermissionString = (permissionIndex) => {
    const PERMISSION = { 1: "View", 2: "Edit", 3: "Admin" };
    return PERMISSION[permissionIndex];
}

const getPermissionInt = (permissionString) => {
    const PERMISSION = { "View": 1, "Edit": 2, "Admin": 3 };
    return PERMISSION[permissionString];
}


export const addEvent = async (calendar, monthTimestamp, eventStartTimestamp, eventEndTimestamp,
    title, color, description, selectedGroupAddress) => {

    // check not null
    if (calendar && monthTimestamp && eventStartTimestamp && eventEndTimestamp && title && color && description) {
        // get selected account
        const account = await getAccount();
        // create cooperatorAddress
        const cooperatorAddress = createCooperatorAddress(selectedGroupAddress);
        // process add event request
        try {
            await calendar.methods.addEvent(monthTimestamp, eventStartTimestamp, eventEndTimestamp,
                title, color, description, cooperatorAddress)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};


export const getEvents = async (calendar, monthTimestamp, selectedGroupAddress) => {

    // check not null
    if (calendar && monthTimestamp) {
        // get selected account
        const account = await getAccount();
        // create cooperatorAddress
        const cooperatorAddress = createCooperatorAddress(selectedGroupAddress);
        // process get events request
        try {
            const result = await calendar.methods.getEvents(monthTimestamp, cooperatorAddress)
                .call({ from: account });
            return {
                status: true,
                result: {
                    eventStartTimestamps: result[0],
                    eventEndTimestamps: result[1],
                    titles: result[2],
                    descriptions: result[3],
                    colors: result[4],
                    createdBys: result[5],
                    indexes: result[6],
                }
            };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false

}


export const updateEvent = async (calendar, monthTimestamp, index, eventStartTimestamp, eventEndTimestamp,
    title, color, description, selectedGroupAddress) => {

    // check not null
    if (calendar && monthTimestamp && index && eventStartTimestamp && eventEndTimestamp && title && color && description) {
        // get selected account
        const account = await getAccount();
        // create cooperatorAddress
        const cooperatorAddress = createCooperatorAddress(selectedGroupAddress);
        // process add event request
        try {
            await calendar.methods.updateEvent(monthTimestamp, index, eventStartTimestamp, eventEndTimestamp,
                title, color, description, cooperatorAddress)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};


export const deleteEvent = async (calendar, monthTimestamp, index, selectedGroupAddress) => {

    // check not null
    if (calendar && monthTimestamp && index) {
        // get selected account
        const account = await getAccount();
        // create cooperatorAddress
        const cooperatorAddress = createCooperatorAddress(selectedGroupAddress);
        // process delete event request
        try {
            await calendar.methods.deleteEvent(monthTimestamp, index, cooperatorAddress)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};



export const getCalendarTitle = async (calendar, selectedGroupAddress) => {

    // check not null
    if (calendar) {
        // get selected account
        const account = await getAccount();
        // create cooperatorAddress
        const cooperatorAddress = createCooperatorAddress(selectedGroupAddress);
        // process get Calendar Title request
        try {
            const result = await calendar.methods.getCalendarTitle(cooperatorAddress)
                .call({ from: account });
            return {
                status: true,
                result: { calendarTitle: result }
            };    // if success, return true
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};


export const updateCalendarTitle = async (calendar, title, selectedGroupAddress) => {

    // check not null
    if (calendar && title) {
        // get selected account
        const account = await getAccount();
        // create cooperatorAddress
        const cooperatorAddress = createCooperatorAddress(selectedGroupAddress);
        // process update Calendar Title request
        try {
            await calendar.methods.updateCalendarTitle(title, cooperatorAddress)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};


export const changeManager = async (calendar, newManager) => {

    // check not null
    if (calendar && newManager) {
        // get selected account
        const account = await getAccount();
        // process change Manager request
        try {
            await calendar.methods.changeManager(newManager)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};


export const addCooperator = async (calendar, cooperator, permission, name, selectedGroupAddress) => {

    // check not null
    if (calendar && cooperator && permission && name) {
        // get selected account
        const account = await getAccount();
        // create cooperatorAddress
        const cooperatorAddress = createCooperatorAddress(selectedGroupAddress);
        // change permission to number
        permission = getPermissionInt(permission);
        // process add cooperator request
        try {
            await calendar.methods.addCooperator(cooperator, permission, name, cooperatorAddress)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};


export const getCooperators = async (calendar, selectedGroupAddress) => {

    // check not null
    if (calendar) {
        // get selected account
        const account = await getAccount();
        // create cooperatorAddress
        const cooperatorAddress = createCooperatorAddress(selectedGroupAddress);
        // process get cooperators request
        try {
            const result = await calendar.methods.getCooperators(cooperatorAddress)
                .call({ from: account });
            const permissions = result[1].map(permission => getPermissionString(permission));

            return {
                status: true,
                result: {
                    names: result[0],
                    permissions: permissions
                }
            };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
}


export const deleteCooperator = async (calendar, index, cooperator, selectedGroupAddress) => {

    // check not null
    if (calendar && index && cooperator) {
        // get selected account
        const account = await getAccount();
        // create cooperatorAddress
        const cooperatorAddress = createCooperatorAddress(selectedGroupAddress);
        // process remove cooperator request
        try {
            await calendar.methods.deleteCooperator(index, cooperator, cooperatorAddress)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};


export const updateCooperator = async (calendar, cooperator, name, permission, selectedGroupAddress) => {

    // check not null
    if (calendar && cooperator && name && permission) {
        // get selected account
        const account = await getAccount();
        // create cooperatorAddress
        const cooperatorAddress = createCooperatorAddress(selectedGroupAddress);
        // change permission to number
        permission = getPermissionInt(permission);
        // process update cooperator request
        try {
            await calendar.methods.updateCooperator(cooperator, name, permission, cooperatorAddress)
                .send({ from: account });
            return { status: true };    // if success, return true
        } catch (ex) {
            return { status: false, reason: ex };   //if not success, return false
        }
    }
    return { status: false, reason: "Something Empty" };   //if something missed, return false
};