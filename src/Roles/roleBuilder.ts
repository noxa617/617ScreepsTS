import { States } from 'Helpers/CreepData';

const roleBuilder = {
  run(creep: Creep): void {
    if (creep.memory.state === States.Building && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.state = States.Harvesting;
    }
    if (creep.memory.state === States.Building && creep.store.getFreeCapacity() === 0) {
      creep.memory.state = States.Building;
    }

    if (creep.memory.state === States.Building) {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      }
    } else {
      const sources = creep.room.find(FIND_SOURCES_ACTIVE);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) creep.moveTo(sources[0]);
    }
  }
};
export default roleBuilder;
