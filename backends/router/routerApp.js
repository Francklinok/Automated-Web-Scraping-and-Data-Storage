import  express from 'express'
const router = express.Router()

import  repos from '../controlle/controlle.js'

router.post('/repositories', repos.addRepository)
router.get('/repositories', repos.getAllRepositories )
router.get('/repositories/:id', repos.getRepositoryById)
router.put('/repositories/:id', repos.updateRepository)
router.delete('/repositories/:id', repos.deleteRepository)


export default router; 
