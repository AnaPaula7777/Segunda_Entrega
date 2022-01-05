import express from 'express';
import cors from 'cors';
import upload from '../services/uploader.js';
const router = express.Router();
import { authMiddleware } from '../utils.js';
import {productos} from '../daos/index.js'


router.use(express.json()); 
router.use(express.urlencoded({extended: true}));
router.use(cors());
router.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    next();
})


//GETS
router.get('/', authMiddleware, (req,res) => {+
    productos.getAll().then(result => {
        res.send(result.payload);
    })
})

router.get('/:id', authMiddleware, (req, res) => {
    let pId = req.params.id; 
    let isNumber = typeof pId === "number" ? true:false;
    if(isNumber) {
        pId = parseInt(pId)
    }
    productos.getById(pId).then(result => {
        res.send(result);
    })
})

//POSTS
router.post('/',upload.single('thumbnail'), authMiddleware,(req,res)=>{
    let file = req.file;
    let cuerpo = req.body;
    cuerpo.thumbnail = req.protocol+"://"+req.hostname+":8080"+'/images/'+file.filename; // protocol es https, luego ://, req.hostname es localhost, :8080 es el puerto que estamos usando
    productos.saveProduct(cuerpo).then(result => {
        res.send(result);
    })
})

//PUTS
router.put('/:id', authMiddleware,(req,res) => {
    let pId = req.params.id;
    let isNumber = typeof pId === "number" ? true:false;
    if(isNumber) {
        pId = parseInt(pId)
    }
    let body = req.body;
    productos.updateElement(pId,body).then(result => {
        res.send(result);
    })
})

// DELETES
router.delete('/:id', authMiddleware,(req,res) => {
    let pId = req.params.id;
    let isNumber = typeof pId === "number" ? true:false;
    if(isNumber) {
        pId = parseInt(pId)
    }
    productos.deleteById(pId).then(result => {
        res.send(result);
    })
})

export default router;