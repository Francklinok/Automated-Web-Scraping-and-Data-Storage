// Importing express library to handle HTTP requests
import express from 'express';

// Creating a new router object using express.Router()
const router = express.Router();

// Importing repository-related functions from the controller
import repos from '../controlle/controlle.js';

// Route to handle the creation of a new repository (POST request)
router.post('/repositories', repos.addRepository);

// Route to get all repositories (GET request)
router.get('/repositories', repos.getAllRepositories);

// Route to find repositories by name (GET request)
router.get('/repository', repos.findReposByName);

// Route to get a specific repository by its ID (GET request)
router.get('/repositories/:id', repos.getRepositoryById);

// Route to update a repository by its ID (PUT request)
router.put('/repositories/:id', repos.updateRepository);

// Route to delete a repository by its ID (DELETE request)
router.delete('/repositories/:id', repos.deleteRepository);

// Exporting the router to be used in the main application
export default router;
