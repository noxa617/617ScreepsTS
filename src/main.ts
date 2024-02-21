import { ErrorMapper } from 'utils/ErrorMapper';
import roleHarvester from 'Roles/roleHarvester';
import roleUpgrader from 'Roles/roleUpgrader';
import { States } from 'Helpers/CreepData';

declare global {
  interface memory {
    memory: CreepMemory;
  }

  // creep base memory
  interface CreepMemory {
    role: string;
    state: string;
  }
}

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
  const harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'harvester');
  console.log('Harvesters: ' + harvesters.length.toString());

  const upgraders = _.filter(Game.creeps, creep => creep.memory.role === 'upgrader');
  console.log('Upgraders: ' + upgraders.length.toString());

  if (harvesters.length < 2) {
    const newName = 'Harvester' + Game.time.toString();
    console.log('Spawning new harvester: ' + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'harvester', state: States.Idle }
    });
  } else if (upgraders.length < 2) {
    const newName = 'Upgrader' + Game.time.toString();
    console.log('Spawning new upgrader: ' + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'upgrader', state: States.Idle }
    });
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep);
    }
    if (creep.memory.role === 'upgrader') {
      roleUpgrader.run(creep);
    }
  }
});
