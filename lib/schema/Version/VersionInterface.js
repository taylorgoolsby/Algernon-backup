//      

import sqltag, { join } from '@taylorgoolsby/sql-template-tag'
import database from "../database.js";
import DeviceInfo from "react-native-device-info";
// import type {VersionSQL} from "./VersionSchema.mjs";

                          
                  
                
                      
                          
                      
                      
 

function getVersion() {
  const appVersion = DeviceInfo.getVersion()
  const buildNumber = DeviceInfo.getBuildNumber()
  const version = appVersion
  console.log("DeviceInfo.getVersion()", version);
  return version
}

export default class VersionInterface {
  static async getCurrent()                       {
    const version = getVersion()
    const query = sqltag`
      SELECT * FROM Version
      WHERE version = ${version}
      AND stage = 'prod'
      ORDER BY dateCreated;
    `
    const rows = await database.query(query)
    return rows[0]
  }

  static async insertCurrentVersion()                {
    const version = getVersion()
    const sql = sqltag`
      SELECT * FROM Version
      WHERE version = ${version};
    `

    const rows = await database.query(sql)
    if (!rows.length) {
      const query = sqltag`
        INSERT INTO Version (
          version,
          stage
        ) VALUES (
          ${version},
          'prod'
        );
      `
      await database.query(query)
    }
  }

  static async setMigrated(
    version        ,
    runtime        ,
    migrationScript        ,
  )                {
    const query = sqltag`
      UPDATE Version SET
      isMigrated = TRUE,
      migrationScript = ${migrationScript}
      WHERE version = ${version}
      AND stage = ${runtime};
    `
    await database.query(query)
  }
}
