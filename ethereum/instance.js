import web3 from "./web3";
import Calendar from "./builds/Calendar.json";
import Group from "./builds/Group.json";

export const getCalendarInstance = (address) => {
  return new web3.eth.Contract(Calendar.abi, address);
};

export const getGroupInstance = (address) => {
  return new web3.eth.Contract(Group.abi, address);
};

