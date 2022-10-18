// Upgrader AI code
const states = { Harvesting: 'Harvesting', Upgrading: 'Upgrading', Idle: 'Idle' };

const roleUpgrader = {
  /** @param creep **/
  run(creep: Creep): void {
    const source = Game.getObjectById(creep.memory.sourceID);
    if (source != null) {
      if (creep.harvest(source) === ERR_NOT_IN_RANGE && creep.store.getFreeCapacity() > 0) {
        creep.moveTo(source);
        creep.memory.state = states.Harvesting;
      } else if (!(creep.store.getFreeCapacity() > 0) || !(source.energy > 0)) {
        if (creep.room.controller) {
          if (creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
          }
        }
      }
    } else {
      creep.say('This Source does not exist');
      creep.memory.state = states.Idle;
    }
  }
};

export default roleUpgrader;
