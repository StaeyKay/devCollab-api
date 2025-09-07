import { Router } from "express";
import { getUserById, login, signUp } from "../controllers/user.js";

const router = Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/:userId', getUserById)

export default router;