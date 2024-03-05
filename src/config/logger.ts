import developmentLogger from './developmentLogger'
let logger : any = null
const env = process.env.NODE_ENV  ? process.env.NODE_ENV  : 'development'
console.log("logger file : ", env)
if(env === 'development'){
    logger = developmentLogger()
}

export default logger