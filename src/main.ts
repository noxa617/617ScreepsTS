import { ErrorMapper } from 'utils/ErrorMapper';
import { States } from 'Helpers/CreepData';
import { buildingswitcher } from 'Helpers/WorldData';
import roleBuilder from 'Roles/roleBuilder';
import roleHarvester from 'Roles/roleHarvester';
import roleHauler from 'Roles/roleHauler';
import roleUpgrader from 'Roles/roleUpgrader';

const NUM_BUILDER = 3;
const NUM_UPGRADER = 3;
const NUM_HAULER = 4;
// var NUM_MOVER = 1;
// var NUM_REPAIRER = 1;
// var NUM_SCOUTS = 1;
// var NUM_ATTACKERS = 1;
// var NUM_CLAIMERS = 1;
// var NUM_RESERVERS = 0;

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

  const sources: Source[] = Game.spawns.Spawn1.room.find(FIND_SOURCES);
  const NUM_HARVESTER = 2; // sources.length;

  const builders = _.filter(Game.creeps, creep => creep.memory.role === 'builder');
  console.log('Builders: ' + builders.length.toString());

  const harvesters = _.filter(Game.creeps, creep => creep.memory.role === 'harvester');
  console.log('Harvesters: ' + harvesters.length.toString());

  const haulers = _.filter(Game.creeps, creep => creep.memory.role === 'hauler');
  console.log('Haulers: ' + haulers.length.toString());

  const upgraders = _.filter(Game.creeps, creep => creep.memory.role === 'upgrader');
  console.log('Upgraders: ' + upgraders.length.toString());

  if (harvesters.length < NUM_HARVESTER) {
    const newName = 'Harvester' + Game.time.toString();
    console.log('Spawning new harvester: ' + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, WORK, MOVE], newName, {
      memory: { role: 'harvester', state: States.Idle }
    });
  } else if (haulers.length < NUM_HAULER) {
    const newName = 'Hauler' + Game.time.toString();
    Game.spawns.Spawn1.spawnCreep([CARRY, CARRY, MOVE, MOVE], newName, {
      memory: { role: 'hauler', state: States.Idle }
    });
  } else if (upgraders.length < NUM_UPGRADER) {
    const newName = 'Upgrader' + Game.time.toString();
    console.log('Spawning new upgrader: ' + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'upgrader', state: States.Idle }
    });
  } else if (builders.length < NUM_BUILDER) {
    const newName = 'Builder' + Game.time.toString();
    console.log('Spawning new builder: ' + newName);
    Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], newName, {
      memory: { role: 'builder', state: States.Idle }
    });
  }

  for (const name in Game.creeps) {
    const creep = Game.creeps[name];
    if (creep.memory.role === 'harvester') {
      roleHarvester.run(creep);
    }
    if (creep.memory.role === 'hauler') {
      roleHauler.run(creep);
    }
    if (creep.memory.role === 'upgrader') {
      roleUpgrader.run(creep);
    }
    if (creep.memory.role === 'builder') {
      roleBuilder.run(creep);
    }
  }

  for (const room in Game.rooms) {
    const roomLevel = Game.rooms[room].controller?.level;
    const currentRoom = Game.rooms[room];
    if (roomLevel) {
      buildingswitcher(roomLevel, currentRoom);
    }
  }
});
