import { Router } from 'express';
import { asyncRoute } from '../middlewares/async-route.js';
import { requireAuth } from '../middlewares/auth.js';
import * as controller from '../controllers/admin.controller.js';
const router=Router(); router.use(requireAuth); router.get('/submissions',asyncRoute(controller.listSubmissions)); router.patch('/submissions/:id/status',asyncRoute(controller.updateStatus)); export default router;
