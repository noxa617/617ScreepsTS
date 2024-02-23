import { States } from 'Helpers/CreepData';

const roleBuilder = {
  /** @param {Creep} creep **/
  run(creep: Creep): void {
    if (creep.memory.state === States.Building && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.state = States.Harvesting;
    }
    if (!(creep.memory.state === States.Building) && creep.store.getFreeCapacity() === 0) {
      creep.memory.state = States.Building;
    }

    if (creep.memory.state === States.Building) {
      const targets = creep.room.find(FIND_CONSTRUCTION_SITES);
      if (targets.length) {
        if (creep.build(targets[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0]);
        }
      } else {
        const closestRepairs = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: Structure => Structure.hits < Structure.hitsMax
        });
        if (closestRepairs) {
          if (creep.repair(closestRepairs) === ERR_NOT_IN_RANGE) {
            creep.moveTo(closestRepairs);
          }
        }
      }
    } else {
      const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: Resource => Resource.resourceType === RESOURCE_ENERGY
      });

      const closestDroppedEnergy = creep.pos.findClosestByRange(droppedEnergy);
      if (closestDroppedEnergy) {
        if (creep.pickup(closestDroppedEnergy) === ERR_NOT_IN_RANGE) {
          creep.moveTo(closestDroppedEnergy);
        }
      }
    }
  }
};

export default roleBuilder;
