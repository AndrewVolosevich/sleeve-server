import { Request, Response } from 'express';
const {Router} = require('express')
const router = Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const {check, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const config = require('config')


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
      res.status(400).json({message: 'Пользователь с таким email уже существует'})
    } else if (password !== confirm) {
      res.status(400).json({message: 'Пароли не совпадают'})
    } else {
      const hashedPassword = await bcrypt.hash(password, 12)
      const user = new User({
        email, password: hashedPassword, cart: {items: []}
      })

      await user.save()
      res.status(201).json({message: 'Вы успешно зарегистрировались'})
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
      const user = await User.findOne({email})
      if (!user) {
        return res.status(400).json({ message: 'Пользователь с таким email не найден' })
      }
      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
      }

      const token = jwt.sign(
        { userId: user.id },
        config.get('jwtSecret'),
        { expiresIn: '30 days' }
      )

      res.json({ token, userId: user.id })
  } catch (error) {
    res.status(500).json({message: 'Что-то пошло не так, попробуйте еще раз ...'})
  }
})

router.post(
    '/info',
    async(req: Request, res:Response) => {
      try {

        const {token} = req.body

        let decoded = await jwt.verify(token, config.get('jwtSecret'));
        res.json({userId: decoded.userId})
      } catch (error) {
        res.status(500).json({message: 'Что-то пошло не так, попробуйте еще раз ...'})
      }
    })

module.exports = router
