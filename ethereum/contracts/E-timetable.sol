// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;


contract Calendar{
    // information of an event
    struct Event{
        uint startTimestamp;
        uint endTimestamp;
        string title;   // summary
        string color;
        string description;
        address createdBy;
    }

    // variables of a Calendar instance
    enum Permission{REJECT, VIEW, EDIT,ADMIN}   // 0,1,2,3

    mapping(uint=>Event[]) private events;
    address public manager;
    string private calendarTitle;
    address[] private cooperators;
    mapping(address=>Permission) private cooperatorPermission;
    mapping(address=>string) private cooperatorName;

    // modifers
    modifier adminRestricted(address[] memory cooperatorAddress){
        require(checkAccess(cooperatorAddress, Permission.ADMIN));
        _;
    }

    modifier viewRestricted(address[] memory cooperatorAddress){
        require(checkAccess(cooperatorAddress, Permission.VIEW));
        _;
    }

    modifier editRestricted(address[] memory cooperatorAddress){
        require(checkAccess(cooperatorAddress, Permission.EDIT));
        _;
    }

    // constrcutor of Calendar contract
    constructor(string memory title, address _manager, string memory name){
        manager = _manager;
        calendarTitle = title;
        cooperatorPermission[manager] = Permission.ADMIN;
        cooperators.push(manager);
        cooperatorName[manager] = name;
    }

    // a helper function for checking access
    function checkAccess(address[] memory addresses, Permission permission) 
        private view returns (bool){

        for(uint i = 0; i<addresses.length;i++){
            if(cooperatorPermission[addresses[i]] >= permission){
                return true;
            }
        }
        // otherwise, return false
        return false;
    }

    // Create Event
    function addEvent(uint monthTimestamp, uint eventStartTimestamp, uint eventEndTimestamp, string memory title, string memory color,
        string memory description, address[] memory cooperatorAddress) public editRestricted(cooperatorAddress){
        // construct a new event
        Event memory newEvent = Event({
            startTimestamp : eventStartTimestamp,
            endTimestamp: eventEndTimestamp,
            title : title,
            color: color,
            description: description,
            createdBy: msg.sender
        });

        // save the new event 
        events[monthTimestamp].push(newEvent);
    }

    // Get Events
    function getEvents(uint monthTimestamp, address[] memory cooperatorAddress) public view viewRestricted(cooperatorAddress)
            returns(uint[] memory eventStartTimestamps, uint[] memory eventEndTimestamps, 
            string[] memory titles, string[] memory colors, string[] memory descriptions, 
            address[] memory createdBys, uint[] memory indexes) {
        // get events in provided month's timestamp
        Event[] memory eventsInProvidedMonthTimestamp = events[monthTimestamp];

        // init return variables
        uint size = eventsInProvidedMonthTimestamp.length;        
        eventStartTimestamps = new uint[](size);
        titles = new string[](size);
        descriptions = new string[](size);
        colors = new string[](size);
        createdBys = new address[](size);
        indexes = new uint[](size);

        // fill return variables
        for(uint i=0; i<size;i++){
            eventStartTimestamps[i] = eventsInProvidedMonthTimestamp[i].startTimestamp;
            eventEndTimestamps[i] = eventsInProvidedMonthTimestamp[i].endTimestamp;
            titles[i] = eventsInProvidedMonthTimestamp[i].title;
            descriptions[i] = eventsInProvidedMonthTimestamp[i].description;
            colors[i] = eventsInProvidedMonthTimestamp[i].color;
            createdBys[i] = eventsInProvidedMonthTimestamp[i].createdBy;
            indexes[i] = i;
        }
    }

    // Update Event
    function updateEvent(uint monthTimestamp, uint index, uint eventStartTimestamp, uint eventEndTimestamp, 
        string memory title, string memory color, string memory description, 
        address[] memory cooperatorAddress) public editRestricted(cooperatorAddress){
        // create new event struct for replace existing once
        Event memory newEvent = Event({
            startTimestamp : eventStartTimestamp,
            endTimestamp: eventEndTimestamp,
            title : title,
            color: color,
            description: description,
            createdBy: msg.sender
        });

        // update(replace) event
        events[monthTimestamp][index] = newEvent;
    }

    // Delete Event
    function deleteEvent(uint monthTimestamp, uint index, address[] memory cooperatorAddress) public editRestricted(cooperatorAddress){
        // get the events list in specific month
        Event[] storage eventsInMonth = events[monthTimestamp];

        // delete specific event
        eventsInMonth[index] = eventsInMonth[eventsInMonth.length-1];
        eventsInMonth.pop();
    }

    // Get Calendar Title
    function getCalendarTitle(address[] memory cooperatorAddress) public view viewRestricted(cooperatorAddress) returns(string memory){
        return calendarTitle;
    }

    // Update Calendar Title
    function updateCalendarTitle(string memory title, address[] memory cooperatorAddress) public adminRestricted(cooperatorAddress){
        calendarTitle = title;
    }

    // Change Manager (Transfer Owner)
    function changeManager(address newManager) public{
        // check client is manager
        require(msg.sender == manager);

        // update manager address
        manager = newManager;
        // update new manager permission
        cooperatorPermission[newManager] = Permission.ADMIN;
        // no need to update new manager name
    }

    // Add Cooperator (individual or group address)
    function addCooperator(address cooperator, uint permission, string memory name, address[] memory cooperatorAddress) public adminRestricted(cooperatorAddress){
        // add cooperator in to list and map
        cooperators.push(cooperator);
        cooperatorPermission[cooperator] = Permission(permission);
        cooperatorName[cooperator] = name;
    }

    // Get Cooperators
    function getCooperators(address[] memory cooperatorAddress) public view viewRestricted(cooperatorAddress) returns(address[] memory _cooperators, string[] memory names, uint[] memory permissions){
        // init return variables
        uint size = cooperators.length;
        _cooperators = cooperators;
        names = new string[](size);
        permissions = new uint[](size);

        // fill return variables
        for(uint i=0;i<size;i++){
            names[i] = cooperatorName[cooperators[i]];
            permissions[i] = uint(cooperatorPermission[cooperators[i]]);
        }
        
    }

    // Delete (remove) Cooperator
    function deleteCooperator(uint index, address cooperator, address[] memory cooperatorAddress) public adminRestricted(cooperatorAddress){
        if(cooperator != manager){
            // remove Cooperator information
            delete cooperatorPermission[cooperator];
            delete cooperatorName[cooperator];
            cooperators[index] = cooperators[cooperators.length-1];
            cooperators.pop();
        }
    }

    // Update Cooperator information and permission
    function updateCooperator(address cooperator, string memory name, uint permission, address[] memory cooperatorAddress) public adminRestricted(cooperatorAddress){
        if(cooperator != manager){
            // Update cooperator information and permission
            cooperatorName[cooperator] = name;
            cooperatorPermission[cooperator] = Permission(permission);
        }
    }
}


contract CalendarFactory{
    // modifier to check is manager
    modifier managerRestricted(){
        require(msg.sender == manager);
        _;
    }

    // variables of a CalendarFactory instance
    mapping(address=>address[]) private calendars;
    address payable public manager;

    // constrcutor of CalendarFactory contract
    constructor(){
        manager = payable(msg.sender);
    }

    // Create Calendar
    function createCalendar(string memory title, string memory name) public payable returns(address){
        // create new Calendar instance
        Calendar newCalendar = new Calendar({
            title:title,
            _manager:msg.sender, 
            name:name
        });

        // Record as joined calendar
        calendars[msg.sender].push(address(newCalendar));

        return address(newCalendar);
    }

    // Get Joined Calendars
    function getCalendars() public view returns(address[] memory){
        return calendars[msg.sender];
    }

    // Add (Join) Calendar
    function addCalendar(address calendarAddress) public{
        calendars[msg.sender].push(calendarAddress);
    }

    // Leave Calendar
    function leaveCalendar(uint index) public{
        // get joined calendars list
        address[] storage joinedCalendars = calendars[msg.sender];
        // remove specified calendar
        joinedCalendars[index] = joinedCalendars[joinedCalendars.length-1];
        joinedCalendars.pop();
    }

    // Get Balance (see how much donate have)
    function getBalance() public view managerRestricted returns(uint){
        // return the balance saved in this contract address
        return address(this).balance;
    }

    // Transfer Balance (transfer balance to manager address)
    function transferBalance() public managerRestricted{
        // send the balance saved in this contract address to manager address
        manager.transfer(address(this).balance);
    }
}


contract Group{
    // variables of a Calendar instance
    enum Permission{REJECT,VIEW,ADMIN}   // 0,1,2,3
    string private groupName;
    address[] private members;
    address public manager;
    mapping(address=>Permission) memberPermission;
    mapping(address=>string) memberName;

    // modifers
    modifier adminRestricted(){
        require(memberPermission[msg.sender] >= Permission.ADMIN);
        _;
    }

    modifier viewRestricted(){
        require(memberPermission[msg.sender] >= Permission.VIEW);
        _;
    }

    // constrcutor of Group contract
    constructor(string memory gname, string memory mname, address _manager){
        manager = _manager;
        groupName = gname;
        memberName[_manager] = mname;
        memberPermission[_manager] = Permission.ADMIN;
    }

    // Add Member
    function addMember(address memberAddress, string memory name, uint permission) public adminRestricted{
        members.push(memberAddress);
        memberPermission[memberAddress] = Permission(permission);
        memberName[memberAddress] = name;
    }

    // Get all Members
    function getMembers() public view viewRestricted returns(address[] memory membersAddress, string[] memory names, uint[] memory permissions){
        // init return variables
        uint size = members.length;
        membersAddress = members;
        names = new string[](size);
        permissions = new uint[](size);

        // fill return variables
        for(uint i=0;i<size;i++){
            names[i] = memberName[members[i]];
            permissions[i] = uint(memberPermission[members[i]]);
        }
    }

    // Update Member Information
    function updateMember(address memberAddress, string memory name, uint permission) public adminRestricted{
        memberName[memberAddress] = name;
        memberPermission[memberAddress] = Permission(permission);
    }

    // Delete (remove) Member from group
    function deleteMember(uint index, address memberAddress) public adminRestricted{
        if(memberAddress != manager){
            // remove Cooperator information
            delete memberPermission[memberAddress];
            delete memberName[memberAddress];
            members[index] = members[members.length-1];
            members.pop();
        }
    }

    // Get Group Name
    function getGroupName() public view viewRestricted returns(string memory){
        return groupName;
    }

    // Update Group Name
    function updateGroupName(string memory name) public adminRestricted{
        groupName = name;
    }

    // Change (transfer) Manager
    function changeManager(address newManager) public{
        // check client is manager
        require(msg.sender == manager);

        // update manager address
        manager = newManager;
        // update new manager permission
        memberPermission[newManager] = Permission.ADMIN;
        // no need to update new manager name
    }
}


contract groupFactory{
    // variables of a Calendar instance
    mapping(address=>address[]) private groups;
    address payable public manager;

    // modifers
    modifier managerRestricted(){
        require(msg.sender == manager);
        _;
    }

    // constrcutor of Group contract
    constructor(){
        manager = payable(msg.sender);
    }

    // Create Group
    function createGroup(string memory gname, string memory mname) public payable returns(address){
        // create new Group instance
        Group newGroup = new Group({
            gname:gname,
            _manager:msg.sender, 
            mname:mname
        });

        address newGroupAddress = address(newGroup);

        // Record as joined calendar
        groups[msg.sender].push(newGroupAddress);

        return newGroupAddress;
    }

    // Get Joined Groups
    function getGroups() public view returns(address[] memory) {
        return groups[msg.sender];
    }

    // Add (Join) Group
    function addGroup(address groupAddress) public{
        groups[msg.sender].push(groupAddress);
    }

    // Leave Group
    function leaveGroup(uint index) public{
        // get joined groups list
        address[] storage joinedGroups = groups[msg.sender];
        // remove specified group
        joinedGroups[index] = joinedGroups[joinedGroups.length-1];
        joinedGroups.pop();
    }

    // Get Balance (see how much donate have)
    function getBalance() public view managerRestricted returns(uint){
        // return the balance saved in this contract address
        return address(this).balance;
    }

    // Transfer Balance (transfer balance to manager address)
    function transferBalance() public managerRestricted{
        // send the balance saved in this contract address to manager address
        manager.transfer(address(this).balance);
    }
}