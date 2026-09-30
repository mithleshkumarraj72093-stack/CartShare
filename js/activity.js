function renderActivity() {
  const session = getSession();
  const room = loadRoom(session.roomCode);
  if (!room) return;

  const list = document.getElementById("activityList");
  list.innerHTML = "";

  const logs = [...room.activityLog].reverse();

  if (logs.length === 0) {
    list.innerHTML = `<li class="text-muted">No activity yet.</li>`;
    return;
  }

  logs.forEach((log) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${escapeHtml(log.user)}</strong>
      <span class="text-muted">${escapeHtml(log.action)}</span>
      <br />
      <small class="text-muted">${formatTime(log.time)}</small>
    `;
    list.appendChild(li);
  });
}