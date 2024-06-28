import {Company} from "../models/Company.js";

export const addCompany = async(req, res) => {

    try {
        const company = new Company(req.body);
        await company.save();
        res.status(201).json({message: "Company Created Successfully"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error Creating Company"});
    }
}

export const getAllCompanies = async(req, res) => {
    
        try {
            const companies = await Company.find();
            res.json(companies);
            
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Error Fetching Companies"});
        }
}

export const getCompany = async(req, res) => {
    
        try {

            const {name} = req.body;

            if(!name) {
                return res.status(400).json({message: "Please Provide Company Name"});
            }

            const company = await Company.findOne({name:name});

            if(!company) {
                return res.status(404).json({message: "Company Not Found"});
            }
    
            res.json(company);
            
        } catch (error) {
            console.log(error);
            res.status(500).json({message: "Error Fetching Company"});
        }
}

export const updateCompany = async(req, res) => {
    try {

        const {name, ...updateData} = req.body;

        if(!name) {
            return res.status(400).json({message: "Please Provide Company Name"});
        }

        const company = await Company.findOneAndUpdate({name:name}, updateData, {new: true});

        if(!company) {
            return res.status(404).json({message: "Company Not Found"});
        }


        res.json(company);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error Updating Company"});
        
    }
};


export const deleteCompany = async(req, res) => {
    try {

        const {name} = req.body;

        const company = await Company.findOne({name});

        if(!company) {
            return res.status(404).json({message: "Company Not Found"});
        }

        await company.deleteOne();

        // // const company = await Company.findByIdAndDelete(req.params.id);
        // if(!company) {
        //     return res.status(404).json({message: "Company Not Found"});
        // }

        res.json({message: "Company Deleted Successfully"});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error Deleting Company"});
    }
}

