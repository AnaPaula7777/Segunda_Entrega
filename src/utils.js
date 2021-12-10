import {fileURLToPath} from 'url';
import {dirname} from 'path';

const filename= fileURLToPath(import.meta.url);
const __dirname = dirname(filename);

export const authMiddleware = (req,res,next)=>{
    if(!req.auth) res.status(403).send({error:-1,message:`Ruta ${req.baseUrl} método ${req.method} no autorizado`})
    else next();
}


export default __dirname;