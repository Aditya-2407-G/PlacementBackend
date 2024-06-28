import {Company} from "../models/Company.js";
import {Student} from "../models/Student.js";
 
export const getPlacementSchedule = async (req, res) => {

    try {

        const schedule = await Company.find({
            dateOfVisit: {$gte: new Date()}
        }).sort({dateOfVisit: "ascending"})
        .select('-_id -createdAt -updatedAt -__v');

        res.json(schedule);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error Fetching Placement Schedule"});
    }
}

export const getProfile = async (req, res) => {

    try {

        const userId = req.user.userId; 

        const student = await Student.findOne({user: userId}).select('isPlaced offers -_id');

        if(!student) {
            return res.status(404).json({message: "Student Not Found"});
        }
        
        res.json(student);
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Error Fetching Profile"});
    }
}

