import * as Helper from 'Helpers/CreepData';
import { Brain } from 'AI/Brain';
import { ErrorMapper } from 'utils/ErrorMapper';
import roleHarvester from 'Roles/Harvester';

declare global {
  interface memory {
    memory: CreepMemory;
  }

  // creep base memory
  interface CreepMemory {
    role: string;
    sourceID: Id<Source>;
    state: string;
  }
}

const maxHarvesters = 4;
const brain: Brain = new Brain();
// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  // Automatically delete memory of missing creeps
  for (const name in Memory.creeps) {
    if (!(name in Game.creeps)) {
      delete Memory.creeps[name];
    }
  }
  const Harvesters: Creep[] = _.filter(
    Game.creeps,
    creep => creep.memory.role === Helper.Roles.Harvester
  );

  if (Harvesters.length < maxHarvesters) {
    const newName = 'Harvester' + Game.time.toString();
    Game.spawns.Spawn1.spawnCreep([MOVE, CARRY, CARRY, WORK], newName, {
      memory: {
        role: Helper.Roles.Harvester,
        sourceID: brain.setSourceAtBirth(),
        state: Helper.States.Idle
      }
    });
  }
  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === Helper.Roles.Harvester) {
      roleHarvester.run(creep);
    }
  }
});
