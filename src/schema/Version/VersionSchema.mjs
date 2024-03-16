// @flow

import gql from 'graphql-tag'

export type VersionSQL = {
  version: string,
  stage: string,
  isMigrated: boolean,
  migrationScript: string,
  dateUpdated: string,
  dateCreated: string,
}

export const typeDefs: any = gql`
  type Version {
    version: String @sql(type: "VARCHAR(10)", primary: true)
    stage: String @sql(type: "VARCHAR(30)", primary: true)
    isMigrated: Boolean @sql(default: "FALSE")
    migrationScript: String @sql(type: "MEDIUMTEXT", nullable: true)
    dateUpdated: String @sql(type: "TIMESTAMP", default: "CURRENT_TIMESTAMP")
    dateCreated: String @sql(type: "TIMESTAMP", default: "CURRENT_TIMESTAMP")
  }
`
