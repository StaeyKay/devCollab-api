import { JoinRequest } from "../models/joinRequest.js";
import Project from "../models/project.js";

// Create a new join request
export const createJoinRequest = async (req, res, next) => {
    try {
        const { projectId, requestedRole, message, userId } = req.body;

        if (!projectId) {
            const error = new Error("Project ID is required");
            error.statusCode = 400;
            return next(error);
        }

        if (!requestedRole) {
            const error = new Error("Requested role is required");
            error.statusCode = 400;
            return next(error);
        }
        
        // Check if project exists
        const project = await Project.findById(projectId);
        if (!project) {
            const error = new Error("Project not found");
            error.statusCode = 404;
            return next(error);
        }

        // Check if the requested role is needed in the project
        // if (!project.rolesNeeded.includes(requestedRole.toLowerCase())) {
        //     const error = new Error(`This role '${requestedRole}' is not needed for this project. Available roles: ${project.rolesNeeded.join(', ')}`);
        //     error.statusCode = 400;
        //     return next(error);
        // }

        // Check if user already has a pending request for this project
        const existingRequest = await JoinRequest.findOne({
            projectId,
            user: req.user._id,
            status: "pending"
        });

        if (existingRequest) {
            const error = new Error("You already have a pending request for this project");
            error.statusCode = 400;
            return next(error);
        }

        const joinRequest = await JoinRequest.create({
            projectId,
            user: req.user._id,
            requestedRole,
            message
        });

        // Add join request to project
        project.joinRequests.push(joinRequest._id);
        await project.save();

        await joinRequest.populate('user', 'username email profilePic');
        await joinRequest.populate('projectId', 'name description');

        res.status(201).json({
            success: true,
            message: "Join request created successfully",
            joinRequest
        });

    } catch (error) {
        next(error);
    }
};

// Get all join requests for a specific project
export const getProjectJoinRequests = async (req, res, next) => {
    try {
        const { projectId } = req.params;
        
        const project = await Project.findById(projectId)
            .populate({
                path: 'joinRequests',
                populate: [
                    { path: 'user', select: 'username email profilePic' },
                    { path: 'projectId', select: 'name description' }
                ]
            });

        if (!project) {
            const error = new Error("Project not found");
            error.statusCode = 404;
            return next(error);
        }

        // Check if user is project owner
        if (project.ownerId.toString() !== req.user._id.toString()) {
            const error = new Error("Not authorized to view join requests");
            error.statusCode = 403;
            return next(error);
        }

        res.status(200).json({
            success: true,
            count: project.joinRequests.length,
            requests: project.joinRequests
        });
    } catch (error) {
        next(error);
    }
};

// Get all join requests made by the current user
export const getUserJoinRequests = async (req, res, next) => {
    try {
        const requests = await JoinRequest.find({ user: req.user._id })
            .populate('projectId', 'name description')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });

    } catch (error) {
        next(error);
    }
};

// Update join request status (accept/reject)
export const updateJoinRequestStatus = async (req, res, next) => {
    try {
        const { requestId } = req.params;
        const { status } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            const error = new Error("Invalid status");
            error.statusCode = 400;
            return next(error);
        }

        const joinRequest = await JoinRequest.findById(requestId);
        if (!joinRequest) {
            const error = new Error("Join request not found");
            error.statusCode = 404;
            return next(error);
        }

        // Verify if user has permission (should be project owner)
        const project = await Project.findById(joinRequest.projectId);
        if (project.ownerId.toString() !== req.user._id.toString()) {
            const error = new Error("Not authorized to update join request");
            error.statusCode = 403;
            return next(error);
        }

        joinRequest.status = status;
        joinRequest.reviewedBy = req.user._id;
        await joinRequest.save();

        // If accepted, you might want to add the user to project members
        if (status === "accepted") {
            project.contributors.push({
                userId: joinRequest.user,
                role: joinRequest.requestedRole
            });
            
            // Remove from joinRequests array since it's no longer pending
            project.joinRequests = project.joinRequests.filter(
                request => request._id.toString() !== requestId.toString()
            );
            await project.save();
        }

        res.status(200).json({
            success: true,
            message: `Join request ${status}`,
            joinRequest
        });

    } catch (error) {
        next(error);
    }
};

// Withdraw join request
export const withdrawJoinRequest = async (req, res, next) => {
    try {
        const { requestId } = req.params;

        const joinRequest = await JoinRequest.findById(requestId);
        if (!joinRequest) {
            const error = new Error("Join request not found");
            error.statusCode = 404;
            return next(error);
        }

        // Verify if user is the one who made the request
        if (joinRequest.user.toString() !== req.user._id.toString()) {
            const error = new Error("Not authorized to withdraw this request");
            error.statusCode = 403;
            return next(error);
        }

        if (joinRequest.status !== "pending") {
            const error = new Error("Can only withdraw pending requests");
            error.statusCode = 400;
            return next(error);
        }

        joinRequest.status = "withdrawn";
        await joinRequest.save();

        // Remove join request from project
        const project = await Project.findById(joinRequest.projectId);
        project.joinRequests = project.joinRequests.filter(
            request => request.toString() !== requestId
        );
        await project.save();

        res.status(200).json({
            success: true,
            message: "Join request withdrawn successfully",
            joinRequest
        });

    } catch (error) {
        next(error);
    }
};
