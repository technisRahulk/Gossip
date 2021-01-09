const generateMessage=(username,text)=>{
    return {
        username,
        message:text,
        timeStamp: new Date().getTime()
    }
}
const generateLocation=(username,url)=>{
    return {
        username,
        url,
        timeStamp: new Date().getTime()
    }
}
module.exports={
    generateMessage,
    generateLocation
}