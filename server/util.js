const success=(statusCode,result)=>{
    return {
        status:'ok',
        statusCode,
        result
    }
}
const error=(statusCode,message)=>{
    return {
        status:'error',
        statusCode,
        message: typeof message === 'string' ? message : 
               (message && Object.keys(message).length > 0 ? JSON.stringify(message) : 'An unexpected error occurred')
    }
}
module.exports={success,error};