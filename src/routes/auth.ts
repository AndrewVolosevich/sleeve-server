import { Request, Response } from 'express';
const {Router} = require('express')
const router = Router()

router.post('/register', async(req: Request, res:Response) => {
  try {
    const {email, password, confirm} = req.body


    res.json({email, password, confirm})
  } catch (error) {
    res.status(500).json({message: 'Something goes wrong ....  Please try again...'})
  }
})

router.post('/login', async(req: Request, res:Response) => {
  try {
    const {email, password} = req.body


    res.json({email, password})
  } catch (error) {
    res.status(500).json({message: 'Something goes wrong ....  Please try again...'})
  }
})

module.exports = router
