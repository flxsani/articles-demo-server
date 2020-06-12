import { Router } from 'express';
import userRoutes from './users/user_srv_ctrl';
import adminRoutes from './admin/admin_srv_ctrl';
import articleRoutes from './articles/article_srv_ctrl';
let router = Router();


router.use('/users', userRoutes);
router.use('/admin', adminRoutes);
router.use('/articles', articleRoutes);
module.exports = router;