//      

import gql from "graphql-tag";

export const CompletionType = {
  GENERAL: 'GENERAL',
  SHORT_TERM_MEMORY: 'SHORT_TERM_MEMORY',
  LONG_TERM_MEMORY: 'LONG_TERM_MEMORY',
}

                                                             

                             
                       
                           
                
                         
                            
                     
                     
 

export const typeDefs      = gql`
  type Completion {
    completionId: Int @sql(primary: true, auto: true)
    type: String @sql(type: "TEXT")
    model: String @sql(type: "TEXT")
    completionOptions: JSON @sql(type: "TEXT")
    inputs: JSON @sql(type: "TEXT")
    output: JSON @sql(type: "TEXT")
    dateCreated: String @sql(type: "TIMESTAMP", default: "CURRENT_TIMESTAMP")

    id: String
  }
`
