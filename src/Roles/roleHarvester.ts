import { States } from 'Helpers/CreepData';

const roleHarvester = {
  run(creep: Creep): void {
    if (creep.store.getFreeCapacity() > 0) {
      const sources = creep.room.find(FIND_SOURCES_ACTIVE);
      if (creep.harvest(sources[0]) === ERR_NOT_IN_RANGE) {
        creep.moveTo(sources[0]);
        creep.memory.state = States.Harvesting;
      }
    } else {
      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: structure => {
          return (
            (structure.structureType === STRUCTURE_EXTENSION ||
              structure.structureType === STRUCTURE_SPAWN) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        }
      });
      if (targets.length > 0) {
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
          creep.memory.state = States.Depositing;
        }
      } else {
        creep.memory.state = States.Idle;
      }
    }
  }
};
export default roleHarvester;
