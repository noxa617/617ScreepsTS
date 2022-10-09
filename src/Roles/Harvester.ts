// Harvester code
const states = { Harvesting: 'Harvesting', Depositing: 'Depositing', Idle: 'Idle' };

const roleHarvester = {
  /** @param {Creep} creep **/
  run(creep: Creep): void {
    const source = Game.getObjectById(creep.memory.sourceID);
    if (source != null) {
      if (creep.harvest(source) === ERR_NOT_IN_RANGE && creep.store.getFreeCapacity() > 0) {
        creep.moveTo(source);
        creep.memory.state = 'Harvesting';
      } else if (!(creep.store.getFreeCapacity() > 0) || !(source.energy > 0)) {
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
        if (closestTarget != null) {
          if (creep.transfer(closestTarget, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
            creep.moveTo(closestTarget);
            creep.memory.state = states.Depositing;
          }
        }
      }
    } else {
      creep.say('This Source does not exist');
      creep.memory.state = states.Idle;
    }
  }
};

export default roleHarvester;
