// generate-sql.js
import sqlDirective from 'graphql-to-sql'
import gql from 'graphql-tag'
import * as Version from '../lib/schema/Version/VersionSchema.mjs'

const {
  sqlDirectiveTypeDefs,
  generateSql
} = sqlDirective('sql')

const typeDefs = gql`
  directive @sql (
    unicode: Boolean
    auto: Boolean
    default: String
    index: Boolean
    nullable: Boolean
    primary: Boolean
    type: String
    unique: Boolean
    generated: String
    constraints: String
  ) on OBJECT | FIELD_DEFINITION

  # See graphql-directive-private
  directive @private on OBJECT | FIELD_DEFINITION

  ${Version.typeDefs}
`

const sql = generateSql({typeDefs: [typeDefs, sqlDirectiveTypeDefs]}, {
  databaseName: 'public', // for postgres, keeping public is recommended.
  tablePrefix: 'test', // or test_
  dbType: 'mysql' // or postgres
})
console.log('sql', sql)
