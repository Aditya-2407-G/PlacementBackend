import mongoose, { Schema } from "mongoose";

const StudentSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,  
        },
        rollNumber: {
            type: String,
            required: true,
            unique: true,
        },
        course: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        isPlaced: {
            type: Boolean,
            default: false,
        },
        offers: [
            {
                company: {
                    type: String
                },
                jobProfile: String,
                OfferDate: Date,
                status: {
                    type: String,
                    enum: ["accepted", "rejected", "pending"],
                    default: "pending",
                },
                salary: String,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export const Student = mongoose.model("Student", StudentSchema);
