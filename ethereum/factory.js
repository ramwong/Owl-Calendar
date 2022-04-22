import web3 from './web3';
import CalendarFactory from './build/CalendarFactory.json';
import GroupFactory from './build/GroupFactory.json';
import addresses from './addresses/addresses.json';

export const calendarFactory = new web3.eth.Contract(
  CalendarFactory.abi,
  addresses.CalendarFactory
);

export const groupFactory = new web3.eth.Contract(
  GroupFactory.abi,
  addresses.GroupFactory
);
