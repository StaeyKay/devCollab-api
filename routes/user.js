import { Router } from "express";
import { forgotPassword, getUserById, loadUser, login, logout, profileUpload, resetPassword, signUp } from "../controllers/user.js";
import { fileUpload } from "../config/fileUpload.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/loadUser', loadUser)
router.get('/:userId', getUserById);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:resetPasswordToken', resetPassword);
router.post('/logout', logout);
router.post('/upload', protect, fileUpload.single('avatar'), profileUpload);

export default router;