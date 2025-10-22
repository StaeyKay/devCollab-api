import { Router } from "express";
import { forgotPassword, getUserById, loadUser, login, logout, profileUpload, resetPassword, signUp, updateUser } from "../controllers/user.js";
import { fileUpload } from "../config/fileUpload.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/loadUser', loadUser)
router.get('/:userId', getUserById);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:resetPasswordToken', resetPassword);
router.patch('/:userId', updateUser)
router.post('/logout', logout);
router.patch('/:userId/profilePhoto', protect, fileUpload.single('avatar'), profileUpload);

export default router;