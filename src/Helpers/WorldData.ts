import RCL1Buildings from './RoomControlLevel/RCL1';
import RCL2Buildings from './RoomControlLevel/RCL2';

export const HOME_WORLD = Object.values(Game.spawns)[0].room.name;

export function buildingswitcher(roomLevel: number, room: Room): void {
  // All controlled rooms start at RCL 1 (update code for reserved rooms when applicable)
  switch (roomLevel) {
    case 1:
      RCL1Buildings.run(room);
      break;

    case 2:
      RCL2Buildings.run(room);
      break;

    // #region hidden other room levels for tidiness
    /*
    case 3:
      RCL_3_Buildings();
      break;

    case 4:
      RCL_4_Buildings();
      break;

    case 5:
      RCL_5_Buildings();
      break;

    case 6:
      RCL_6_Buildings();
      break;

    case 7:
      RCL_7_Buildings();
      break;

    case 8:
      RCL_8_Buildings();
      break; */
    // #endregion
  }
}
