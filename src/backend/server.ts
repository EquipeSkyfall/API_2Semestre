import express,{Express} from 'express'

import { PORT } from "./src/secrets"

import app from './src/index';

app.listen(PORT,() =>{console.log(`running on 127.0.0.1:${PORT}`)})