import web3 from "./web3";
import Calendar from "./build/Calendar.json";
import Group from "./build/Group.json";

export const getCalendarInstance = (address) => {
  return new web3.eth.Contract(Calendar.abi, address);
};

export const getGroupInstance = (address) => {
  return new web3.eth.Contract(Group.abi, address);
};

