import { Router } from 'express';
import api from '../api';
import home_srv_ctl from '../web/components/home/home_srv_ctl';

let router = Router();

router.use('/', home_srv_ctl);
router.use('/api', api);
module.exports = router;