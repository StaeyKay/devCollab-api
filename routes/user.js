import { Router } from "express";
import { forgotPassword, getUserById, loadUser, login, logout, resetPassword, signUp } from "../controllers/user.js";

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/loadUser', loadUser)
router.get('/:userId', getUserById);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:resetPasswordToken', resetPassword);
router.post('/logout', logout)

export default router;