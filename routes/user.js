import { Router } from "express";
import { forgotPassword, getUserById, login, resetPassword, signUp } from "../controllers/user.js";

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/:userId', getUserById);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:resetPasswordToken', resetPassword);

export default router;