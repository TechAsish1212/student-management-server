import { Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { AcademicYear } from "../models/Academic.model";
import { activityLog } from "../utils/activityLogs";

export const createAcademicYear = async (req: Request, res: Response) => {
    try {
        const { name, fromYear, toYear, isCurrent } = req.body;
        const existingYear = await AcademicYear.findOne({ fromYear, toYear });
        if (existingYear) {
            throw new ApiError(400, "Academic Year already exist");
        }
        if (isCurrent) {
            await AcademicYear.updateMany(
                { _id: { $ne: null } },
                { isCurrent: false });
        }
        const academicYear = await AcademicYear.create({
            name,
            fromYear,
            toYear,
            isCurrent: isCurrent || false
        })
        await activityLog({
            userId: (req as any).user._id,
            action: `Created Academic year with ${name}`
        })
        res.status(201).json({
            message: "Academic Year Created Successfully",
            academicYear
        });
    } catch (error) {
        console.log("Academic creation error:: ", error);
        if (error instanceof ApiError) {
            throw error;
        }

        throw new ApiError(500, "Internal Server Error");
    }
}

// get academic year
export const getCurrentAcademicYear = async (req: Request, res: Response) => {
    try {
        const currentYear = await AcademicYear.findOne({ isCurrent: true });
        if (!currentYear) {
            throw new ApiError(404, 'No current academic year found');
        } else {
            res.status(200).json(currentYear);
        }
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server Error")
    }
}

// update academic year
export const updateAcademicYear = async (req: Request, res: Response) => {
    try {
        const { name, fromYear, toYear, isCurrent } = req.body;
        const academicYear = await AcademicYear.findById(req.params.id);
        if (!academicYear) {
            throw new ApiError(404, "Academic year not found");
        }
        if (isCurrent) {
            await AcademicYear.updateMany({}, { $set: { isCurrent: false } });
        }

        academicYear.name = name || academicYear.name;
        academicYear.fromYear = fromYear || academicYear.fromYear;
        academicYear.toYear = toYear || academicYear.toYear;
        academicYear.isCurrent !== undefined ? isCurrent : academicYear.isCurrent;

        await academicYear.save();

        await activityLog({
            userId: (req as any).user._id,
            action: `Updated Academic Year ${academicYear.name}`,
        });

        return res.status(200).json({
            message: 'Academic year updated successfully',
            academicYear
        })


    } catch (error) {
        console.log("Update academic year error:: ", error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
}

// delete academic year
export const deleteAcademicYear = async (req: Request, res: Response) => {
    try {
        const year = await AcademicYear.findById(req.params.id);
        if (!year) {
            throw new ApiError(404, "Academic Year Not Found");
        }
        if (year) {
            if (year.isCurrent) {
                throw new ApiError(400, "Can't delete this current academic year");
            }
        }
        await year.deleteOne();

        await activityLog({
            userId: (req as any).user._id,
            action: `Delete academic year ${year.name}`,
        })
        return res.status(200).json({ message: 'Academic year deleted successfully' });
    } catch (error) {
        console.log('Delete academic year error:: ', error);
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal server error");
    }
}

// get all academic year
export const getAllAcademicYear = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = req.query.search as string;
        const skip = (page - 1) * limit;


        const query: any = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        const [total, years] = await Promise.all([
            AcademicYear.countDocuments(query),
            AcademicYear.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);

        return res.status(200).json({
            years,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit)
            }
        })

    } catch (error) {
        console.log('Get all academic year:: ', error);

        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(500, "Internal Server Error");
    }
}