// @flow

import { sqltag, join } from 'sql-template-tag'
import database from "./database.js";

export default class VersionInterface {
  static async create() {
    const sql = sqltag`
      CREATE TABLE IF NOT EXISTS Version (
        version VARCHAR(10) PRIMARY KEY,
        stage VARCHAR(30),
        isMigrated BOOLEAN DEFAULT FALSE,
        migrationScript MEDIUMTEXT,
        dateUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        dateCreated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await database.query(sql);
  }

  static async getCurrent(): Promise<?VersionSQL> {
    const query = sqltag`
      SELECT * FROM Version
      WHERE version = ${Config.version}
      AND stage = ${Config.dbPrefix.sql}
      ORDER BY dateCreated;
    `
    const rows = await database.query(query)
    return rows[0]
  }

  static async insertCurrentVersion(): Promise<void> {
    const query = sqltag`
      INSERT INTO Version (
        version,
        stage
      ) VALUES (
        ${Config.version},
        ${Config.dbPrefix.sql}
      ) ON DUPLICATE KEY UPDATE version = version;
    `
    await database.query(query)
  }

  static async setMigrated(
    version: string,
    runtime: string,
    migrationScript: string,
  ): Promise<void> {
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
