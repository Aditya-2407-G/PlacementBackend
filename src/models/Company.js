import mongoose, { Schema } from "mongoose";

const companySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        jobProfile: String,
        jobDescription: String,
        salary: String,
        eligibilityCriteria: String,
        dateOfVisit: Date,
    },
    {
        timestamps: true,
    }
);

export const Company = mongoose.model("Company", companySchema);