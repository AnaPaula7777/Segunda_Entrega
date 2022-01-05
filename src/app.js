import express from 'express';
import cors from 'cors';
import {engine} from 'express-handlebars';
import Contenedor from './contenedores/Contenedor.js';
import productosRouter from './routes/productos.js';
import carritosRouter from './routes/carritos.js';
import upload from './services/uploader.js';
import __dirname from './utils.js';
const app = express();
const PORT = process.env.PORT || 8080;
const productos = new Contenedor('./files/productos.txt');

const server = app.listen(PORT, () => {
    console.log("Servidor escuchando en: ", PORT)
});


app.engine('handlebars',engine())
app.set('views',__dirname+'/views')
app.set('view engine','handlebars')


const admin = true;
app.use(express.json()); 
app.use(express.urlencoded({extended: true}));
app.use(cors());
app.use((req,res,next)=>{
    console.log(new Date().toTimeString().split(" ")[0], req.method, req.url);
    req.auth = admin;
    next();
})
app.use(express.static(__dirname+'/public'));
app.use('/api/productos', productosRouter);
app.use('/api/carritos', carritosRouter);

app.post('/api/uploadfile',upload.fields([
    {
        name:'file', maxCount:1
    },
    {
        name:"documents", maxCount:3
    }
]),(req,res)=>{
    const files = req.files;
    if(!files||files.length===0){
        res.status(500).send({messsage:"No se subió archivo"})
    }
    res.send(files);
})

app.get('/view/productos',(req,res)=>{
    productos.getAll().then(result=>{
        let info = result.payload;
        let preparedObject = {
            productos : info
        }
        res.render('productos',preparedObject);
    })
})
