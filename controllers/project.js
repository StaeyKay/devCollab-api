import { Project } from "../models/project.js";

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find()
      .populate("ownerId", "username email")
      .populate("contributors.userId", "username email");
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("ownerId", "username email")
      .populate("contributors.userId", "username email");

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

    await project.save();

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
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const addContributor = async (req, res, next) => {
    const {userId, userRole} = req.body;

    if(!userId || !userRole){
        
    const error = new Error('all fields required');
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
