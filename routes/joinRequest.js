import { Router } from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    createJoinRequest,
    getProjectJoinRequests,
    getUserJoinRequests,
    updateJoinRequestStatus,
    withdrawJoinRequest
} from "../controllers/joinRequest.js";

const router = Router();

// All routes require authentication
router.use(protect);

// Create a new join request
router.post("/create", createJoinRequest);

// Get all join requests for a project
router.get("/project/:projectId", getProjectJoinRequests);

// Get all join requests made by the current user
router.get("/my-requests", getUserJoinRequests);

// Update join request status (accept/reject)
router.patch("/:requestId/status", updateJoinRequestStatus);

// Withdraw join request
router.patch("/:requestId/withdraw", withdrawJoinRequest);

export default router;
