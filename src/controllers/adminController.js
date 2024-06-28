import {Student} from '../models/Student.js';
import {PlacementActivity} from '../models/PlacementActivity.js';
import { Company } from '../models/Company.js';


export const getActivities = async (req, res) => {
    try {

        const activities = await Company.find({
            dateOfVisit: {$gte: new Date()}
        }).sort({dateOfVisit: "ascending"})
        .select('-_id -createdAt -updatedAt -__v');

        res.status(200).json(activities);

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error Fetching Placement Activities",
        });
    }
};

export const addActivity = async (req, res) => {
    try {
        const activity = new PlacementActivity(req.body);
        await activity.save();
        res.status(201).json({
            message: "Placement Activity Created Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Creating Placement Activity" });
    }
};

export const getStudentStats = async (req, res) => {
    try {

        const totalStudents = await Student.countDocuments();
        const placedStudents = await Student.countDocuments({ isPlaced: true });
        const unplacedStudents = totalStudents - placedStudents;


        res.json({
            totalStudents,
            placedStudents,
            unplacedStudents,
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error Fetching Students" });
    }
};

export const getStudents =  async (req, res) => {
    try {
        const students = await Student.find().select('-_id -createdAt -updatedAt -__v');
        res.status(200).json(students);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error Fetching Students information"});
    }
}

export const updateStudentStatus = async (req, res) => {

    try {

        const {rollNumber, isPlaced, companyName} = req.body;

        if(!rollNumber || isPlaced === undefined) {
            return res.status(400).json({message: "Please Provide Roll Number and placement status"});
        }

        const student = await Student.findOne({rollNumber});
        
        if(!student) {
            return res.status(404).json({message: "Student Not Found"});
        }

        student.isPlaced = isPlaced;

        if(isPlaced && companyName) {

            let company = await Company.findOne({name: companyName});

            if(!company) {
                return res.status(404).json({message: "Company Not Found"});
            }

            const offer = {
                company: company.name,
                jobProfile: company.jobProfile || 'Not Specified',
                OfferDate: new Date(),
                status: 'accepted',
                salary:  company.salary
            }

            student.offers.push(offer);
        }

        await student.save();


        res.status(200).json({message: "Student Status Updated Successfully", 
            student: {name: student.name, rollNumber: student.rollNumber, isPlaced: student.isPlaced, offers: student.offers}});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error Updating Student Status"});
    }   
}

export const removeCompanyFromStudent = async (req, res) => {

    try {

        const {rollNumber, companyName} = req.body;

        if(!rollNumber || !companyName) {
            return res.status(400).json({message: "Please Provide Roll Number and Company Name"});
        }

        const student = await Student.findOne({rollNumber});

        console.log(student);

        if(!student) {
            res.status(404).json({message: "Student Not Found"});
        }

        const offerIdx = student.offers.find(offer => offer.company === companyName);

        if(offerIdx === -1) {
            return res.status(404).json({message: "Company Not Found in Student Offers"});
        }

        student.offers.splice(offerIdx, 1);

        if(student.offers.length === 0) {
            student.isPlaced = false;
        }

        await student.save();

        res.status(200).json({message: "Company Removed Successfully", student: {name: student.name, rollNumber: student.rollNumber, isPlaced: student.isPlaced, offers: student.offers}});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error Removing Company"});
    }
}