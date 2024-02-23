const roleHauler = {
  /** @param {Creep} creep **/
  run(creep: Creep): void {
    if (creep.store.getFreeCapacity() > 0) {
      const droppedEnergy = creep.room.find(FIND_DROPPED_RESOURCES, {
        filter: Resource => Resource.resourceType === RESOURCE_ENERGY
      });

      const closestDroppedEnergy = creep.pos.findClosestByRange(droppedEnergy);
      if (closestDroppedEnergy)
        if (creep.pickup(closestDroppedEnergy) === ERR_NOT_IN_RANGE) {
          creep.moveTo(closestDroppedEnergy);
        }
    } else {
      const allSpawns = creep.room.find(FIND_MY_STRUCTURES, {
        filter: Structure => {
          return (
            Structure.structureType === STRUCTURE_SPAWN &&
            Structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        }
      });

      const closestSpawn = creep.pos.findClosestByRange(allSpawns);

      const targets = creep.room.find(FIND_STRUCTURES, {
        filter: Structure => {
          return (
            (Structure.structureType === STRUCTURE_SPAWN ||
              Structure.structureType === STRUCTURE_EXTENSION ||
              Structure.structureType === STRUCTURE_TOWER ||
              Structure.structureType === STRUCTURE_CONTAINER) &&
            Structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        }
      });
      const closestTarget = creep.pos.findClosestByRange(targets);
      if (closestSpawn && creep.transfer(closestSpawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        creep.moveTo(closestSpawn);
      } else if (
        closestTarget &&
        creep.transfer(closestTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE
      ) {
        creep.moveTo(closestTarget);
      } else {
        // keeping haulers out of harms way kinda
        creep.moveTo(Game.spawns.Spawn1.pos.x + 5, Game.spawns.Spawn1.pos.y + 5);
      }
    }
  }
};

export default roleHauler;
