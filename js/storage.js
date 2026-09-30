const STORAGE_PREFIX = "cartshare_";
const SESSION_KEY = STORAGE_PREFIX + "session";

function saveSession(session) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function getSession() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

function roomKey(code) {
  return STORAGE_PREFIX + "room_" + code;
}

function saveRoom(room) {
  localStorage.setItem(roomKey(room.roomCode), JSON.stringify(room));
}

function loadRoom(code) {
  const raw = localStorage.getItem(roomKey(code));
  return raw ? JSON.parse(raw) : null;
}

function deleteRoom(code) {
  localStorage.removeItem(roomKey(code));
}

function generateRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  if (loadRoom(code)) return generateRoomCode();
  return code;
}

function formatCurrency(amount) {
  return "₹" + Number(amount).toLocaleString("en-IN");
}

function formatTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}