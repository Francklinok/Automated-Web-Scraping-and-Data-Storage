import  app from '../models/model.js';

//add one or sevral reposotory
 const  addRepository = async(req,res) =>{
    try{
       const  repositorie = await app.insertMany(req.body);
       res.status(201).json({message:'repositories addes successfully', data:repositorie})
    }catch(error){
        res.status(500).json({message:'error adding repository', error})
    }
}

//get all repository
 const getAllRepository = async(req, res) =>{
    try{
       const repository = await app.find();
       res.status(200).json(repository)
    }catch(error){
        res.status(500).json({message : 'error fetching repositior', error})

    }

}

// find  repository by id
 const  findReposById = async(req, res) =>{
    try{
        const repository = await app.findById(req.params.id)
        res.status(200).json(repository)

    }catch(error){
        res.status(500).json({message : 'error fetching repositior', error})
    }
 }

 // updated repository
 const  updatedRepos = async(req, res) =>{
    try {
        const repository = await app.findByIdAndUpdate(req.params.id, req.body, {new: true})
        if(!repository) res.json({message:'repositior is not found'})
        res.status(200).json({message: "repository updated successfully", data:repository})
    }catch(error){
        res.status(500).json({message : 'error updating repositior', error})
    }
 }

 //delete repository
 const deletRepos = async(req, res) =>{
    try{
        const repository = await app.findByIdAndDelete(req.params.id);
        if(!repository) return res.status(404).json({message:'Repository not found'});
        res.status(200).json({message:'Repository deleted succesfully'})

    }catch(error){
        res.status(500).json({message : 'error deleting repositior', error})

    }
 }
 const controllers = { addRepository, getAllRepository, findReposById, updatedRepos, deletRepos };
 export default controllers;
 
