import { Request, Response } from 'express';
const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')


router.post(
  '/register',
  [
    check('email', 'некорректный email').normalizeEmail().isEmail(),
    check('password', 'минимальная длина пароля 6 символов').isLength({ min: 6 })
  ],
  async(req: Request, res:Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({message: errors.errors[0].msg})
    }

    const {email, password, confirm} = req.body
    const candidate = await User.findOne({email})
    if (candidate) {
      res.json({message: 'ALREDY_EXIST'})
    } else if (password !== confirm) {
      res.json({message: 'WRONG_PASSWORD'})
    } else {
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({
        email, password: hashedPassword, cart: {items: []}
      })

      await user.save()
      res.status(201).json({message: 'SUCCESS'})
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({errors: [error], message: 'Something goes wrong ....  Please try again...'})
  }
})

router.post(
  '/login',
  [
    check('email', 'некорректный email').normalizeEmail().isEmail(),
    check('password', 'минимальная длина пароля 6 символов').isLength({ min: 6 })
  ],
  async(req: Request, res:Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({message: errors.errors[0].msg})
    }

    const {email, password} = req.body

    res.json({email, password})
  } catch (error) {
    res.status(500).json({message: 'Something goes wrong ....  Please try again...'})
  }
})

module.exports = router
