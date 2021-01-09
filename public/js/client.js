const messageForm=document.querySelector('#inp')
const messageFormInput=messageForm.querySelector('input')
const messageFormButton=messageForm.querySelector('button')
const locationButton=document.querySelector('#loc')
const $messages=document.querySelector('#messages')

//Templates
const messageTemplate=document.querySelector('#msg-template').innerHTML
const locMsgTemplate=document.querySelector('#loc-template').innerHTML
const sidebarTemplate=document.querySelector('#sidebar-template').innerHTML
//client recieves from server 
const socket=io()

const autoscroll = () =>{
    //new msg element
    const $newMsg=$messages.lastElementChild;
    //new mesg height
    const newMsgStyles=getComputedStyle($newMsg);
    const newMsgMargin=parseInt(newMsgStyles.marginBottom);
    const newMsgHeight=$newMsg.offsetHeight + newMsgMargin;
    //visible height
    const visHeight=$messages.offsetHeight;
    //container height
    const containerHeight=$messages.scrollHeight;
    //how far scrolled
    const scrollOffset=($messages.scrollTop + visHeight)*2;
    
    if(containerHeight - newMsgHeight < scrollOffset){
        $messages.scrollTop=$messages.scrollHeight;    
    }
};
socket.on('updateClient',(msg)=>{
    //rendering messages to the web page
    if(msg.message=='')
     return 
    const html=Mustache.render(messageTemplate,{
        username:msg.username,
        message:msg.message,
        time:moment(msg.timeStamp).format(`h:mm a`)
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
socket.on('locationMsg',(location)=>{
    console.log(location)
    const html=Mustache.render(locMsgTemplate,{
        username:location.username,
        url:location.url,
        time:moment(location.timeStamp).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
//rendering users list event listener
socket.on('userList',({room,users})=>{
    const html=Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
})
//client sends to server 
messageForm.addEventListener('submit',(e)=>{
    e.preventDefault()
    messageFormButton.setAttribute('disabled','disabled')
    const a=e.target.elements.message.value
    socket.emit('incremented',a,(error)=>{
        messageFormButton.removeAttribute('disabled','disabled')
        messageFormInput.value=``
        messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('Message delhivered!')
    })
})

locationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation not supported')
    }
    locationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('location',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            locationButton.removeAttribute('disabled','disabled')
            console.log("Location sent !")
        })
    })

})
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})
socket.emit('join',{
    username,room
},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})

