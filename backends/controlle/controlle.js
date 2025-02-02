import RepositoryModel from '../models/model.js';

// Add one or more repositories
const addRepository = async (req, res) => {
    try {
        // Log the received data
        console.log("Received data:", req.body);
        
        // Check if the request body is empty or invalid
        if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
            return res.status(400).json({ message: "Invalid data" });
        }

        // Insert multiple repositories into the database
        const repositories = await RepositoryModel.insertMany(req.body);
        // Respond with success message and inserted repositories
        res.status(201).json({ message: 'Repositories added successfully', data: repositories });
    } catch (error) {
        // Log error and respond with failure message
        console.error("Error adding repositories:", error);
        res.status(500).json({ message: 'Error adding repository', error: error.message });
    }
};

// Find a repository by name
const findReposByName = async (req, res) => {
    try {
        const { repoName } = req.query;
  
        // Check if repoName is provided in the query string
        if (!repoName) {
            return res.status(400).json({ message: 'Repository name is required' });
        }
  
        // Search for the repository in the database by its name
        const repo = await RepositoryModel.findOne({ RepoName: repoName }).lean();
        console.log(repo, 'test');
  
        // If no repository is found, return a 404 error
        if (!repo) {
            return res.status(404).json({ message: "Repository not found" });
        }
  
        // Return the found repository data
        res.json(repo);
    } catch (error) {
        // Log error and respond with internal server error
        console.error("Error retrieving repository:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// Get all repositories
const getAllRepositories = async (req, res) => {
    try {
        // Retrieve all repositories from the database
        const repositories = await RepositoryModel.find();
        // Respond with the list of repositories
        res.status(200).json(repositories);
    } catch (error) {
        // Log error and respond with failure message
        console.error("Error retrieving repositories:", error);
        res.status(500).json({ message: 'Error retrieving repositories', error: error.message });
    }
};

// Get a repository by its ID
const getRepositoryById = async (req, res) => {
    try {
        // Find the repository by its ID
        const repository = await RepositoryModel.findById(req.params.id);
        
        // If no repository is found, return a 404 error
        if (!repository) return res.status(404).json({ message: 'Repository not found' });
        
        // Respond with the found repository
        res.status(200).json(repository);
    } catch (error) {
        // Log error and respond with failure message
        console.error("Error retrieving repository by ID:", error);
        res.status(500).json({ message: 'Error retrieving repository', error: error.message });
    }
};

// Update a repository by its ID
const updateRepository = async (req, res) => {
    try {
        // Find the repository by its ID and update it
        const repository = await RepositoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        // If no repository is found, return a 404 error
        if (!repository) return res.status(404).json({ message: 'Repository not found' });

        // Respond with the updated repository data
        res.status(200).json({ message: "Repository updated successfully", data: repository });
    } catch (error) {
        // Log error and respond with failure message
        console.error("Error updating repository:", error);
        res.status(500).json({ message: 'Error updating repository', error: error.message });
    }
};

// Delete a repository by its ID
const deleteRepository = async (req, res) => {
    try {
        // Get the repository ID from the request parameters
        const repositoryId = req.params.id;
        console.log(`Deleting repository with ID: ${repositoryId}`);

        // Find and delete the repository by its ID
        const repository = await RepositoryModel.findByIdAndDelete(repositoryId);

        // If no repository is found, return a 404 error
        if (!repository) {
            return res.status(404).json({ message: 'Repository not found' });
        }

        // Respond with a success message
        res.status(200).json({ message: 'Repository deleted successfully' });
    } catch (error) {
        // Log error and respond with failure message
        console.error("Error during repository deletion:", error);
        res.status(500).json({ message: 'Error deleting repository', error: error.message });
    }
};

// Export all the controller functions
export default { 
    addRepository, 
    getAllRepositories, 
    findReposByName, 
    getRepositoryById, 
    updateRepository, 
    deleteRepository 
};



