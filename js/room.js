const FREE_DELIVERY_THRESHOLD = 500;

function createRoom() {
  const session = getSession();
  if (!session || !session.userName) {
    alert("Please enter your name first.");
    return;
  }

  const code = generateRoomCode();
  const room = {
    roomCode: code,
    createdBy: session.userName,
    createdAt: Date.now(),
    members: [session.userName],
    items: [],
    activityLog: [
      {
        user: session.userName,
        action: "created the room",
        time: Date.now(),
      },
    ],
  };

  saveRoom(room);

  session.roomCode = code;
  saveSession(session);

  window.location.href = "cart.html";
}

function joinRoom() {
  const session = getSession();
  if (!session || !session.userName) {
    alert("Please enter your name first.");
    return;
  }

  const input = document.getElementById("roomCodeInput");
  const code = input.value.trim().toUpperCase();
  const errorEl = document.getElementById("roomError");

  if (code.length !== 6) {
    errorEl.textContent = "Room code must be 6 characters.";
    return;
  }

  const room = loadRoom(code);
  if (!room) {
    errorEl.textContent = "Room not found. Check the code.";
    return;
  }

  const alreadyMember = room.members.includes(session.userName);

  if (!alreadyMember) {
    room.members.push(session.userName);
    room.activityLog.push({
      user: session.userName,
      action: "joined the room",
      time: Date.now(),
    });
    saveRoom(room);
  }

  session.roomCode = code;
  saveSession(session);

  window.location.href = "cart.html";
}

function leaveRoom() {
  if (!confirm("Are you sure you want to leave this room?")) return;

  const session = getSession();
  if (!session) {
    window.location.href = "index.html";
    return;
  }

  if (session.roomCode) {
    const room = loadRoom(session.roomCode);
    if (room) {
      room.members = room.members.filter((m) => m !== session.userName);

      room.activityLog.push({
        user: session.userName,
        action: "left the room",
        time: Date.now(),
      });

      saveRoom(room);
    }
  }

  session.roomCode = null;
  saveSession(session);

  window.location.href = "index.html";
}