// In renderer process (web page).
const { ipcRenderer } = require('electron');

let usersList;
// Fetch Users from local backend
fetch('http://localhost:8080/users/info',{
  method:"GET",            
  headers: {
    'Content-Type': 'application/json'
   }
  })
  .then(res => res.json())
  .then(data => {
    console.log(data)
    usersList = data
  })


// Get image of the user
function getImages(username){
  let burl;
  fetch('http://localhost:8080/users/image/'+username,{
  method:"GET",            
  headers: {
    'Content-Type': 'image/png'
  }
  })
  .then(res => res.blob())
  .then(data => {
    console.log(data)
    burl = URL.createObjectURL(data)
    console.log(burl)
  })
  return burl;
}

let memberList;
let speaker;
ipcRenderer.on('speakerInfo', (event, message) => {
  console.log("From Main Speaker list",message)
  speaker = message;
  speakers();
})

function speakers(){
  console.log("YOOOOOOOOOOO",speaker.discriminator)
  var s = document.getElementById(speaker.discriminator)
  s.classList.add('iconspeak')
}

ipcRenderer.on('membersInfo', (event, message) => {
  console.log("From Main Members list",message)
  memberList = message;
  members();
})

function members(){
  let members_list = '';
  for (var it=memberList[0].values(), val = null; val=it.next().value; ) {
    if(usersList.hasOwnProperty(val.username)){
      you = val.username;
      uimg = getImages(val.username);
      console.log(uimg)
      members_list += `
      <div class="person">
        <img src=${uimg} class="icon" id=${val.discriminator}>
        <div class="info">
          <p>${usersList[you]["display_name"]}</p>
          <p id="tag">${usersList[you]["tagline"]}</p> 
        </div>
      </div>
      `
    }
  } 
  document.getElementById('container').innerHTML = members_list;
}
