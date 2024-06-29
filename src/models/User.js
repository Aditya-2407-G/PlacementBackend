import mongoose, {Schema} from "mongoose";

const userSchema  = new Schema({
    
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['admin', 'student'],
        default: 'student'
    },
    refreshToken:{
        type: String,
    }

})

export const User = mongoose.model('User', userSchema);