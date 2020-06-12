import { Router } from 'express';
import UserService from './user_srv';
let userRoutes = Router();
import { CustomError } from '../../../libs/pnkCustomError';

userRoutes.get('/', async (req, res) => {

    console.log('before try of /route - generate');
    try {
        let user = await UserService.AddAdminUser();
        //res.json(user);
        // console.log('after try of /route - generate');
        res.status(200).send({
            status: true,
            message: "New user successfully added"
        });
    }
    catch (e) {
        console.log('in catch of /route - generate category_srv_ctl)');
        // CustomError.FinalizeErrorInChain(e,"",req,res);
        res.send(CustomError.ToJson(e));
    }


});

userRoutes.post('/registration/admin', async (req, res) => {

    console.log('before try of /route - generate');
    try {
        let user = await UserService.AddAdminUser(req, res);
        //res.json(user);
        // console.log('after try of /route - generate');
        res.status(200).send({
            status: true,
            message: "New user successfully added"
        });
    }
    catch (e) {
        console.log('in catch of /route - generate category_srv_ctl)');
        // CustomError.FinalizeErrorInChain(e,"",req,res);
        res.send(CustomError.ToJson(e));
    }


});

userRoutes.post('/registration', async (req, res) => {

    console.log('before try of /route - generate');
    try {
        let user = await UserService.AddUser(req, res);
        //res.json(user);
        // console.log('after try of /route - generate');
        res.status(200).send({
            status: true,
            message: "New user successfully added"
        });
    }
    catch (e) {
        console.log('in catch of /route - generate category_srv_ctl)');
        // CustomError.FinalizeErrorInChain(e,"",req,res);
        res.send(CustomError.ToJson(e));
    }


});

userRoutes.post('/login/admin', async (req, res) => {

    console.log('before try of /route - generate');
    try {
        let user = await UserService.AdminUserLogin(req, res);
        res.json(user);
        // console.log('after try of /route - generate');
        // res.status(200).send({
        //     status: true,
        //     message: "New user successfully added" 
        // });
    }
    catch (e) {
        console.log('in catch of /route - generate category_srv_ctl)');
        // CustomError.FinalizeErrorInChain(e,"",req,res);
        res.send(CustomError.ToJson(e));
    }


});


userRoutes.post('/login', async (req, res) => {

    console.log('before try of /route - generate');
    try {
        let user = await UserService.UserLogin(req, res);
        res.json(user);
        // console.log('after try of /route - generate');
        // res.status(200).send({
        //     status: true,
        //     message: "New user successfully added" 
        // });
    }
    catch (e) {
        console.log('in catch of /route - generate category_srv_ctl)');
        // CustomError.FinalizeErrorInChain(e,"",req,res);
        res.send(CustomError.ToJson(e));
    }


});

module.exports = userRoutes;