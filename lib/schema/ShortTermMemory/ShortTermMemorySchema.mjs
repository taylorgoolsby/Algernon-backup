//      

import gql from 'graphql-tag'
                                                           
                                                              

                                   
                            
                     
                            
                  
                      
  

export const typeDefs      = gql`
  type ShortTermMemory {
    shortTermMemoryId: Int @sql(primary: true, auto: true)
    windowId: Int @sql(type: "INT", default: "0")
    model: JSON @sql(type: "TEXT")
    inputs: JSON @sql(type: "TEXT")
    summary: String @sql(type: "TEXT", unicode: true)
    dateCreated: String @sql(type: "TIMESTAMP", default: "CURRENT_TIMESTAMP")

    id: String
  }
`
