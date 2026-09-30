function goToRoomStep() {
  const name = document.getElementById("userName").value.trim();

  if (name === "") {
    alert("Please enter your name");
    return;
  }

  saveSession({ userName: name, roomCode: null });

  document.getElementById("displayName").textContent = name;
  document.getElementById("step-name").classList.add("d-none");
  document.getElementById("step-room").classList.remove("d-none");
}

function initCartPage() {
  const session = getSession();

  if (!session || !session.userName || !session.roomCode) {
    window.location.href = "index.html";
    return;
  }

  const room = loadRoom(session.roomCode);
  if (!room) {
    alert("Room not found. Please rejoin.");
    window.location.href = "index.html";
    return;
  }

  document.getElementById("navRoomCode").textContent = room.roomCode;
  document.getElementById("navUserName").textContent = session.userName;

  document.getElementById("navRoomCode").style.cursor = "pointer";
  document.getElementById("navRoomCode").title = "Click to copy";
  document.getElementById("navRoomCode").onclick = () => {
    navigator.clipboard.writeText(room.roomCode);
    alert("Room code copied: " + room.roomCode);
  };

  renderAll();

  window.addEventListener("storage", (e) => {
    if (e.key && e.key.startsWith("cartshare_room_")) {
      renderAll();
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) renderAll();
  });
}

function renderAll() {
  renderCart();
  renderActivity();
}

document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("cart.html")) {
    initCartPage();
  }
});