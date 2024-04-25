const mongoose=require('mongoose');
const { type } = require('os');

const msgSchema=new mongoose.Schema({
    message:{
        text:{
            type:String,
            required:true,
        }
    },
    users:Array,
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"userdb",
        required:true,
    }
},
{
    timestamps:true,
}
)

module.exports = mongoose.model('msgdb',msgSchema);