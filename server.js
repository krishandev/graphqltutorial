import {ApolloServer} from 'apollo-server'
import {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core'
import typeDefs from './schemaGql.js'
import mongoose from 'mongoose'
import { JWT_SECRET, Mongo_URI } from './config.js'
import jwt from 'jsonwebtoken'

mongoose.connect(Mongo_URI, {
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.connection.on("Connected", ()=>{
    console.log("Connected to Mongodb")
})

mongoose.connection.on("Error", (err)=>{
   console.log("Error in Mongodb Connection", err)
})

//impot models here
import './models/User.js'
import './models/Quotes.js'

import resolvers from './resolvers.js'
//this is middleware
const context=({req})=>{
    const {authorization}=req.headers
    if(authorization){
       const {userId}=jwt.verify(authorization, JWT_SECRET)
       return {userId}
    }
   }

const server=new ApolloServer({
    typeDefs,
    resolvers,
    context:context,
    plugins:[
        ApolloServerPluginLandingPageGraphQLPlayground()
    ]
})

server.listen().then(({url})=>{
    console.log(`Server is ready ${url}`)
})