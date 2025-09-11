import  Project  from "../models/project.js";
import User from '../models/user.js';



export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("ownerId")
      .populate("contributors.userId");
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("ownerId")
      .populate("contributors.userId");

    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      return next(error);
    }

    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const addProject = async (req, res, next) => {
  const { title, description } = req.body;

  if (!title || !description) {
    const error = new Error("required fields not found");
    error.statusCode = 404;
    next(error);
  }

  try {
    const project = new Project({
      ...req.body,
      ownerId: req.user._id,
    
    });

    project.contributors.push({userId: req.user._id})
    await project.save();


    await User.findByIdAndUpdate(req.user._id, {$push: {projects: project._id}})


    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      return next(error);
    }
    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      return next(error);
    }
    // Todo handle deletion of users with project referenced in their data.
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const addContributor = async (req, res, next) => {
    const {userId, userRole} = req.body;

    if(!userId){
        
    const error = new Error('userId is required');
    error.statusCode = 404;
    return next(error)
  } 
    if(!userRole){
        
    const error = new Error('userRole is required');
    error.statusCode = 404;
    return next(error)
  } 
    
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      return next(error);
    }

    project.contributors.push({
      userId: userId,
      role: userRole,
    });
    await project.save();

    await User.findByIdAndUpdate(userId, {$push : {projects: project._id}})

    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const removeContributor = async (req, res, next) => {
    const contributorId = req.body.userId;
    if(!contributorId){
        const error = new Error('id is required');
        error.statusCode = 401;
        next(error)
    }
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      const error = new Error("Project not found");
      error.statusCode = 404;
      return next(error);
    }

    project.contributors = project.contributors.filter(
      (c) => c.userId.toString() !== contributorId
    );
    await project.save();

    res.json(project);
  } catch (err) {
    next(err);
  }
};
