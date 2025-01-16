import mongoose, { Schema } from "mongoose";

const cryptoSchema = new mongoose.Schema(
    {
        cryptoname: {
            type:String,
            unique:true,
            required: true,
            index:true
        },
        target: {
            type:String,
            required:true,
        },
        
    }, {timestamps: true}
)


export const Crypto = mongoose.model('Crypto', cryptoSchema);