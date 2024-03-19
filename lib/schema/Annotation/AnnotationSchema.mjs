//      

import gql from 'graphql-tag'

                             
                       
                    
               
                           
                      
 

export const typeDefs      = gql`
  type Annotation {
    annotationId: Int @sql(primary: true)
    messageId: Int @sql(type: "INT", index: true)
    text: String @sql(type: "TEXT", unicode: true)
    embedding: JSON @sql(type: "TEXT")
    dateCreated: String @sql(type: "TIMESTAMP", default: "CURRENT_TIMESTAMP")

    id: String
  }
`
