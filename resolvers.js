import {users, quotes} from './fakedb.js'
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from './config.js';

const User=mongoose.model("User")
const Quote=mongoose.model("Quote")
const resolvers={
    Query:{
        users:async()=>await User.find({}),
        user:async(_,{_id})=>await User.findOne({_id}),
        quotes:async()=>await Quote.find({}).populate("by", "_id firstName email"),
        quote:async(_,{by})=>await Quote.find({by})
    },
    User:{
        quotes:async(ur)=>await Quote.find({by:ur._id})
    },
    Mutation:{
        signupUser:async(_,{newUser})=>{
            const user=await User.findOne({email:newUser.email})
            if(user){
                throw new Error("User exist already with this email id.")
            }
            const hashedPassword=await bcrypt.hash(newUser.password, 12)
            const userNew=new User({
                ...newUser, 
                password:hashedPassword
            })
            return await userNew.save();

        },

        signinuser:async(_,{userSignin})=>{
          const user=await User.findOne({email:userSignin.email})
          if(!user){
            throw new Error("User Does Not Exist With This Email.")
          }

          const doMatch=await bcrypt.compare(userSignin.password, user.password)
          if(!doMatch){
            throw new Error("Email or Password are invalid.")
          }
          const token= jwt.sign({userId:user._id}, JWT_SECRET)
          return {token}
        },

        createQuote:async(_,{name}, {userId})=>{
           if(!userId) throw new Error("You must be Logged In.")
           const newQuote= new Quote({
              name,
              by:userId
        })
          await newQuote.save()
          return "Quote Saved Successfully."
        }
    }
}

export default resolvers;