import {gql} from 'apollo-server'

const typeDefs=gql`
type Query{
    users:[User]
    user(_id:ID!):User
    quotes:[QuoteWithName]
    quote(by:ID!):[Quote]
}

type QuoteWithName{
    name:String
    by:IdName
}
type IdName{
    _id:String
    firstName:String
    email:String
}

type Quote{
    name:String
    by:String
}

type Token{
 token:String
}

type Mutation{
    signupUser(newUser:UserInput!):User
    signinuser(userSignin:userSigninInput!):Token
    createQuote(name:String!):String
}
input UserInput{
    firstName:String! 
    lastName:String! 
    email:String! 
    password:String!
}

input userSigninInput{
    email:String!
    password:String!
}

type User{
    _id:ID
    firstName:String!
    lastName:String!
    email:String!
    password:String!
    quotes:[Quote]

}
`
export default typeDefs;
