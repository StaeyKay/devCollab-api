import { Router } from "express";
import {getAllProjects, addProject, getProjectById, updateProject, deleteProject, addContributor, removeContributor } from '../controllers/project.js'
import { protect } from "../middlewares/authMiddleware.js";

const router = Router();



router.get('/', getAllProjects);
router.get('/:id', getProjectById);

router.post('/', protect ,addProject);
router.post('/addContributor/:id',protect, addContributor);

router.patch('/:id', protect,updateProject);

router.delete('/:id',protect, deleteProject);
router.delete('/removeContributor/:id',protect, removeContributor)


export default router