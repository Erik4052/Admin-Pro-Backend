require('dotenv').config();
const express = require('express');
const cors = require('cors');

const {dbConnection} = require('./database/config');
//Crear servidor express
const app = express();
//Configurar CORS
app.use(cors());
//Base de datos
dbConnection();

//console.log(process.env);

//rutas
app.get('/', (req, res) => {
    //user: erik4052
    //contraseña: kakiko99
    res.json({
        ok:true,
        msg:'Hola mundo'
    })



});




app.listen(process.env.PORT, ()=>{
    console.log('Servidor corriendo en puerto' + process.env.PORT);
})