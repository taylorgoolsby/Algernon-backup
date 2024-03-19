// generate-sql.js
import sqlDirective from 'graphql-to-sql'
import gql from 'graphql-tag'
import fs from 'fs'
import * as Annotation from '../lib/schema/Annotation/AnnotationSchema.mjs'
import * as Completion from '../lib/schema/Completion/CompletionSchema.mjs'
import * as Message from '../lib/schema/Message/MessageSchema.mjs'
import * as ShortTermMemory from '../lib/schema/ShortTermMemory/ShortTermMemorySchema.mjs'
import * as Version from '../lib/schema/Version/VersionSchema.mjs'

const {
  sqlDirectiveTypeDefs,
  generateSql
} = sqlDirective('sql')

const typeDefs = gql`
  scalar JSON
  
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


  ${Annotation.typeDefs}
  ${Completion.typeDefs}
  ${Message.typeDefs}
  ${ShortTermMemory.typeDefs}
  ${Version.typeDefs}
`

const sql = generateSql({typeDefs: [typeDefs, sqlDirectiveTypeDefs]}, {
  databaseName: null,
  tablePrefix: null,
  dbType: 'sqlite'
})
console.log('sql', sql)

const sqlModule = `export default \`${sql.replaceAll('`', '\\`')}\``

fs.writeFileSync('src/schema/createTables.js', sqlModule, 'utf8')
