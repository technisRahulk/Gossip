const users=[]
const addUser=(({id,username,room})=>{
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    if(!username || !room){
        return {
            error:"Username and room is required"
        }
    }
    const found=users.find((user)=>{
        return user.room===room && user.username===username
    })

    if(found){
        return {
            error:"Username exists"
        }
    }
    const user={id,username,room}
    users.push(user)
    return {user}
})

const removeUser=((id)=>{
    const ind=users.findIndex((user)=>user.id===id)
    if(ind!=-1){
        return users.splice(ind,1)[0]
    }
    return {
        error:"Can't find user!"
    }
})

const getUser=(id)=>{return users.find((user)=>user.id===id)}

const getUserInRoom=(room)=>{
    room=room.trim().toLowerCase()
    return users.filter((user)=>user.room===room)
}

module.exports={
    addUser,
    removeUser,
    getUser,
    getUserInRoom
}
