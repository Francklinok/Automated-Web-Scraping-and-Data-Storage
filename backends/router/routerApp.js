import  express from 'express'
const router = express.Router()

import  repos from '../controlle/controlle.js'

router.post('/repositories', repos.addRepository)
router.get('/repositories', repos.getAllRepository )
router.get('/repositories/:id', repos.findReposById )
router.put('/repositories/:id', repos.updatedRepos)
router.delete('/repositories/:id', repos.deletRepos)


export default router; 