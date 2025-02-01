import RepositoryModel from '../models/model.js';

// Ajouter un ou plusieurs repositories
const addRepository = async (req, res) => {
    try {
        console.log("Données reçues :", req.body);
        
        if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
            return res.status(400).json({ message: "Les données sont invalides" });
        }

        const repositories = await RepositoryModel.insertMany(req.body);
        res.status(201).json({ message: 'Repositories ajoutés avec succès', data: repositories });
    } catch (error) {
        console.error("Erreur lors de l'ajout :", error);
        res.status(500).json({ message: 'Erreur lors de l\'ajout du repository', error: error.message });
    }
};

const findReposByName = async (req, res) => {
    try {
      const { repoName } = req.query;
  
      if (!repoName) {
        return res.status(400).json({ message: 'Le nom est requis' });
      }
  
      const repo = await RepositoryModel.findOne({RepoName: repoName }).lean();
      console.log(repo,'test')
  
      if (!repo) {
        return res.status(404).json({ message: "Repository non trouvé" });
      }
  
      res.json(repo);
    } catch (error) {
      console.error("Erreur lors de la récupération :", error);
      res.status(500).json({ message: "Erreur interne du serveur", error: error.message });
    }
  };
  

// Récupérer tous les repositories
const getAllRepositories = async (req, res) => {
    try {
        const repositories = await RepositoryModel.find();
        res.status(200).json(repositories);
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        res.status(500).json({ message: 'Erreur lors de la récupération des repositories', error: error.message });
    }
};

// Trouver un repository par ID
const getRepositoryById = async (req, res) => {
    try {
        const repository = await RepositoryModel.findById(req.params.id);
        if (!repository) return res.status(404).json({ message: 'Repository non trouvé' });
        
        res.status(200).json(repository);
    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        res.status(500).json({ message: 'Erreur lors de la récupération du repository', error: error.message });
    }
};

// Mettre à jour un repository
const updateRepository = async (req, res) => {
    try {
        const repository = await RepositoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!repository) return res.status(404).json({ message: 'Repository non trouvé' });

        res.status(200).json({ message: "Repository mis à jour avec succès", data: repository });
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du repository', error: error.message });
    }
};

// Supprimer un repository
// const deleteRepository = async (req, res) => {
//     try {
//         const repository = await RepositoryModel.findByIdAndDelete(req.params.id);
//         if (!repository) return res.status(404).json({ message: 'Repository non trouvé' });

//         res.status(200).json({ message: 'Repository supprimé avec succès' });
//     } catch (error) {
//         console.error("Erreur lors de la suppression :", error);
//         res.status(500).json({ message: 'Erreur lors de la suppression du repository', error: error.message });
//     }
// };
const deleteRepository = async (req, res) => {
    try {
        const repositoryId = req.params.id;
        console.log(`Deleting repository with ID: ${repositoryId}`);

        const repository = await RepositoryModel.findByIdAndDelete(repositoryId);

        if (!repository) {
            return res.status(404).json({ message: 'Repository not found' });
        }

        res.status(200).json({ message: 'Repository deleted successfully' });
    } catch (error) {
        console.error("Error during deletion:", error);
        res.status(500).json({ message: 'Error deleting repository', error: error.message });
    }
};

export default { addRepository, getAllRepositories, findReposByName, getRepositoryById, updateRepository, deleteRepository };
