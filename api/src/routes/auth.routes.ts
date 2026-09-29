import { Router } from 'express';
import { asyncRoute } from '../middlewares/async-route.js';
import { login } from '../controllers/auth.controller.js';
const router=Router(); router.post('/login',asyncRoute(login)); export default router;
