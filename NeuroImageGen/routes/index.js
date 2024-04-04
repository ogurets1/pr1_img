import express from 'express';
import authRoutes from './auth';

const router = express.Router();

// Основной маршрут
router.get('/', (req, res) => {
  res.render('index');
});

// Подключение маршрутов аутентификации
router.use('/auth', authRoutes);

export default router;