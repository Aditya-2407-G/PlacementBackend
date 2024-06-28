import mongoose, {Schema} from "mongoose";

const placementActivitySchema = new Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    company: {
        type: Schema.Types.ObjectId,
        ref: "Company",
    },
})

export const PlacementActivity = mongoose.model('PlacementActivity', placementActivitySchema);