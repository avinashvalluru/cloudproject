socket.on("connect", function (data) {
    console.log("connected");
});

socket.on('loginStatus', async (status) => {
    if (status) {
        document.getElementById("popup").style.display = "none";
        const hintEl = document.getElementById("hint");
        !hintEl.classList.contains("hidden") &&
            hintEl.classList.add("hidden");
        socket.emit("userAdded", username);
        console.log("login Success")
        console.log(socket.id);
        localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        localVideo.srcObject = localStream;
        pc.addStream(localStream);
        pc.onaddstream = function (e) {
            remoteVideo.srcObject = e.stream;
        };
    } else {
        const hintEl = document.getElementById("hint");
        hintEl.classList.contains("hidden") &&
            hintEl.classList.remove("hidden");

    }
})
socket.on('updateUserList', (users) => {
    usersList = users.filter((user) => user.id !== socket.id);
    updateuserList()
})
socket.on('offer', async (data) => {
    console.log("[client] received offer from")
    console.log(data);
    let text = "Getting the call accept or not";
    if (confirm(text) == true) {
        pc.setRemoteDescription({
            type: "offer",
            sdp: data.offer
        });
        const answer = await pc.createAnswer()
        pc.setLocalDescription(answer);
        socket.emit("answer", {
            to: data.fromuser.id,
            answer: answer
        })
    } else {
        text = "You canceled!";
    }

})
socket.on('answer', (data) => {
    pc.setRemoteDescription(new RTCSessionDescription(data.answer));
})
socket.on('candidate', (data) => {
    pc.addIceCandidate(new RTCIceCandidate(data.candidate));
})
