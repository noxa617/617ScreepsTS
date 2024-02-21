import { States } from 'Helpers/CreepData';

const roleUpgrader = {
  run(creep: Creep): void {
    if (creep.memory.state === States.Harvesting && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.state = States.Harvesting;
    }
    if (!(creep.memory.state === States.Upgrading) && creep.store.getFreeCapacity() === 0) {
      creep.memory.state = States.Upgrading;
    }

    if (creep.memory.state === States.Upgrading && creep.room.controller) {
      if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
      }
    }
  }
};
export default roleUpgrader;
