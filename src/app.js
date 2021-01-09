const express= require('express')
const http= require('http')
const socketio= require('socket.io')
const path =require('path')
const Filter=require('bad-words')
const {generateMessage,generateLocation}=require('./utils/message')
const {addUser,removeUser,getUser,getUserInRoom}=require('./utils/user')
 
const app=express()
const server=http.createServer(app)
const io=socketio(server)
const port=process.env.PORT||3000

const publicDir=path.join(__dirname,'../public')
app.use(express.static(publicDir))

io.on('connection',(socket)=>{
    console.log(`Web server connected`)
    //server sends to client
    socket.on('join',(options,callback)=>{
        const {error,user}=addUser({id:socket.id,...options})
        if(error){
            return callback(error)
        }
        socket.join(user.room)
        socket.emit('updateClient',generateMessage("Admin","Welcome to the event")) 
        socket.broadcast.to(user.room).emit('updateClient',generateMessage("Admin",`${user.username} has joined!`))
        io.to(user.room).emit('userList',{
            room:user.room,
            users:getUserInRoom(user.room)
        })
        callback()
    })
    //server recieves from client
    socket.on('incremented',(msg,callback)=>{
        const user=getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(msg)){
            return callback(`Profanity not allowed!`)
        }
        io.to(user.room).emit('updateClient',generateMessage(user.username,msg))
        callback()
    })
    socket.on(`disconnect`,()=>{
        const user=removeUser(socket.id)
        if(user){
            io.to(user.room).emit('userList',{
                room:user.room,
                users:getUserInRoom(user.room)
            })
            io.to(user.room).emit('updateClient',generateMessage("Admin",`${user.username} has left !`))
            
        }
    })
    socket.on('location',(position,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMsg',generateLocation(user.username,`https://google.com/maps?q=${position.latitude},${position.longitude}`))
        callback()
    })
})
server.listen(port,()=>{
    console.log(`Server is up on port ${port}`)
})