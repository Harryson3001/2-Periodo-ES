import { Router } from 'express';
import { asyncRoute } from '../middlewares/async-route.js';
import * as controller from '../controllers/public.controller.js';
const router=Router();
router.post('/contact',asyncRoute(controller.contact));
router.post('/applications/resume',asyncRoute(controller.resume));
router.post('/applications/aggregate',asyncRoute(controller.aggregate));
export default router;
