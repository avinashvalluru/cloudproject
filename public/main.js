username = "";
usersList = [];
var socket = io();
const config = {
  "iceServers": [{ "url": "stun:stun2.1.google.com:19302" }]
};
const pc = new RTCPeerConnection(config);
let localStream = null;
let remoteStream = null;
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');


function submitForm() {
  var name = document.getElementById("username");
  username = name.value;
  socket.emit("login", username);
  return true
}

function updateuserList() {
  var usersHtml = ''
  usersList.forEach((user) => {
    usersHtml += `   <div
            class="flex items-center justify-between px-2 py-4 border-bottom"
          >
            <div class="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="w-6 h-6 text-gray-500"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-person"
                viewBox="0 0 16 16"
              >
                <path
                  d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"
                />
              </svg>
              <h3 class="px-2 text-gray-700">${user.name}</h3>
            </div>
            <div class="flex gap-2">
        
              <button data-id="${user.id}" onclick="onCallClickHandler('${user.id}')">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="w-5 h-5 text-gray-500 hover:text-green-900 ml-2"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-camera-video"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2V5zm11.5 5.175 3.5 1.556V4.269l-3.5 1.556v4.35zM2 4a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H2z"
                  />
                </svg>
              </button>
            </div>
          </div>`;
  });
  document.getElementById("usersListContainer").innerHTML = usersHtml;
}

async function onCallClickHandler(id) {
  pc.onicecandidate = function (event) {
    if (event.candidate) {
      socket.emit("candidate", {
        candidate: event.candidate,
        to: id
      });
    }
  };
  // const offer = await pc.createOffer();
  alert("calling")
  await pc.setLocalDescription(await pc.createOffer());
  console.log("[CLIENT] offer Created");
  console.log("[CLIENT] sending Offer to" + usersList.find(user => user.id === id).name)
  socket.emit("offer", {
    to: id,
    offer: pc.localDescription.sdp,
    name: usersList.find(user => user.id === id).name
  })
}