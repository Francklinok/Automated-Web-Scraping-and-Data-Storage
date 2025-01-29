import app from '../models/model.js';

// Ajouter un ou plusieurs repositories
app.post('/api/repositories', async (req, res) => {
    try {
      const repositories = req.body; // Tableau d'objets
      if (!Array.isArray(repositories) || repositories.length === 0) {
        return res.status(400).json({ error: 'Données invalides' });
      }
  
      await RepositoryModel.insertMany(repositories);
      res.status(201).json({ message: 'Repositories ajoutés avec succès' });
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de l\'ajout des repositories' });
    }
  });

  
// const addRepository = async (req, res) => {
//     try {
//         console.log("Données reçues :", req.body);
        
//         // Vérifier si req.body est un tableau ou un objet
//         if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
//             return res.status(400).json({ message: "Les données sont invalides" });
//         }

//         // Insérer les repositories
//         const repositories = await app.insertMany(req.body);
        
//         res.status(201).json({ message: 'Repositories ajoutés avec succès', data: repositories });
//     } catch (error) {
//         console.error("Erreur lors de l'ajout :", error);
//         res.status(500).json({ message: 'Erreur lors de l\'ajout du repository', error: error.message });
//     }
// };

// Récupérer tous les repositories
const getAllRepository = async (req, res) => {
    try {
        const repositories = await app.find();
        res.status(200).json(repositories);
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        res.status(500).json({ message: 'Erreur lors de la récupération des repositories', error: error.message });
    }
};

// Trouver un repository par ID
const findReposById = async (req, res) => {
    try {
        const repository = await app.findById(req.params.id);
        if (!repository) return res.status(404).json({ message: 'Repository non trouvé' });
        
        res.status(200).json(repository);
    } catch (error) {
        console.error("Erreur lors de la recherche :", error);
        res.status(500).json({ message: 'Erreur lors de la récupération du repository', error: error.message });
    }
};

// Mettre à jour un repository
const updatedRepos = async (req, res) => {
    try {
        const repository = await app.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!repository) return res.status(404).json({ message: 'Repository non trouvé' });

        res.status(200).json({ message: "Repository mis à jour avec succès", data: repository });
    } catch (error) {
        console.error("Erreur lors de la mise à jour :", error);
        res.status(500).json({ message: 'Erreur lors de la mise à jour du repository', error: error.message });
    }
};

// Supprimer un repository
const deletRepos = async (req, res) => {
    try {
        const repository = await app.findByIdAndDelete(req.params.id);
        if (!repository) return res.status(404).json({ message: 'Repository non trouvé' });

        res.status(200).json({ message: 'Repository supprimé avec succès' });
    } catch (error) {
        console.error("Erreur lors de la suppression :", error);
        res.status(500).json({ message: 'Erreur lors de la suppression du repository', error: error.message });
    }
};

const controllers = { addRepository, getAllRepository, findReposById, updatedRepos, deletRepos };
export default controllers;




// import app from '../models/model.js';

// // Ajouter un ou plusieurs repositories
// const addRepository = async (req, res) => {
//     try {
//         console.log("Données reçues :", req.body);
        
//         // Vérifier si req.body est un tableau ou un objet
//         if (!req.body || (Array.isArray(req.body) && req.body.length === 0)) {
//             return res.status(400).json({ message: "Les données sont invalides" });
//         }

//         // Insérer les repositories
//         const repositories = await app.insertMany(req.body);
        
//         res.status(201).json({ message: 'Repositories ajoutés avec succès', data: repositories });
//     } catch (error) {
//         console.error("Erreur lors de l'ajout :", error);
//         res.status(500).json({ message: 'Erreur lors de l\'ajout du repository', error: error.message });
//     }
// };

// // Récupérer tous les repositories
// const getAllRepository = async (req, res) => {
//     try {
//         const repositories = await app.find();
//         res.status(200).json(repositories);
//     } catch (error) {
//         console.error("Erreur lors de la récupération :", error);
//         res.status(500).json({ message: 'Erreur lors de la récupération des repositories', error: error.message });
//     }
// };

// // Trouver un repository par ID
// const findReposById = async (req, res) => {
//     try {
//         const repository = await app.findById(req.params.id);
//         if (!repository) return res.status(404).json({ message: 'Repository non trouvé' });
        
//         res.status(200).json(repository);
//     } catch (error) {
//         console.error("Erreur lors de la recherche :", error);
//         res.status(500).json({ message: 'Erreur lors de la récupération du repository', error: error.message });
//     }
// };

// // Mettre à jour un repository
// const updatedRepos = async (req, res) => {
//     try {
//         const repository = await app.findByIdAndUpdate(req.params.id, req.body, { new: true });
//         if (!repository) return res.status(404).json({ message: 'Repository non trouvé' });

//         res.status(200).json({ message: "Repository mis à jour avec succès", data: repository });
//     } catch (error) {
//         console.error("Erreur lors de la mise à jour :", error);
//         res.status(500).json({ message: 'Erreur lors de la mise à jour du repository', error: error.message });
//     }
// };

// // Supprimer un repository
// const deletRepos = async (req, res) => {
//     try {
//         const repository = await app.findByIdAndDelete(req.params.id);
//         if (!repository) return res.status(404).json({ message: 'Repository non trouvé' });

//         res.status(200).json({ message: 'Repository supprimé avec succès' });
//     } catch (error) {
//         console.error("Erreur lors de la suppression :", error);
//         res.status(500).json({ message: 'Erreur lors de la suppression du repository', error: error.message });
//     }
// };

// const controllers = { addRepository, getAllRepository, findReposById, updatedRepos, deletRepos };
// export default controllers;



// import  app from '../models/model.js';

// //add one or sevral reposotory
//  const  addRepository = async(req,res) =>{
//     try{
//        const  repositorie = await app.insertMany(req.body);
//        console.log(req.body);
//        res.json({message:'test ok'});
//        res.status(201).json({message:'repositories addes successfully', data:repositorie})
//     }catch(error){
//         res.status(500).json({message:'error adding repository', error})
//     }
// }

// //get all repository
//  const getAllRepository = async(req, res) =>{
//     try{
//        const repository = await app.find();
//        res.status(200).json(repository)
//     }catch(error){
//         res.status(500).json({message : 'error fetching repositior', error})

//     }

// }

// // find  repository by id
//  const  findReposById = async(req, res) =>{
//     try{
//         const repository = await app.findById(req.params.id)
//         res.status(200).json(repository)

//     }catch(error){
//         res.status(500).json({message : 'error fetching repositior', error})
//     }
//  }

//  // updated repository
//  const  updatedRepos = async(req, res) =>{
//     try {
//         const repository = await app.findByIdAndUpdate(req.params.id, req.body, {new: true})
//         if(!repository) res.json({message:'repositior is not found'})
//         res.status(200).json({message: "repository updated successfully", data:repository})
//     }catch(error){
//         res.status(500).json({message : 'error updating repositior', error})
//     }
//  }

//  //delete repository
//  const deletRepos = async(req, res) =>{
//     try{
//         const repository = await app.findByIdAndDelete(req.params.id);
//         if(!repository) return res.status(404).json({message:'Repository not found'});
//         res.status(200).json({message:'Repository deleted succesfully'})

//     }catch(error){
//         res.status(500).json({message : 'error deleting repositior', error})

//     }
//  }
//  const controllers = { addRepository, getAllRepository, findReposById, updatedRepos, deletRepos };
//  export default controllers;
 
