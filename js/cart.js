function addItem() {
  const session = getSession();
  const room = loadRoom(session.roomCode);
  if (!room) return;

  const nameEl = document.getElementById("itemName");
  const priceEl = document.getElementById("itemPrice");
  const qtyEl = document.getElementById("itemQty");
  const errorEl = document.getElementById("itemError");

  const name = nameEl.value.trim();
  const price = parseFloat(priceEl.value);
  const qty = parseInt(qtyEl.value);

  if (!name) {
    errorEl.textContent = "Item name is required.";
    return;
  }
  if (isNaN(price) || price <= 0) {
    errorEl.textContent = "Enter a valid price.";
    return;
  }
  if (isNaN(qty) || qty <= 0) {
    errorEl.textContent = "Enter a valid quantity.";
    return;
  }

  errorEl.textContent = "";

  const newItem = {
    id: Date.now() + Math.random(),
    name: name,
    price: price,
    qty: qty,
    addedBy: session.userName,
    time: Date.now(),
  };

  room.items.push(newItem);
  room.activityLog.push({
    user: session.userName,
    action: `added ${qty} x ${name} (${formatCurrency(price)})`,
    time: Date.now(),
  });

  saveRoom(room);

  nameEl.value = "";
  priceEl.value = "";
  qtyEl.value = "1";

  renderAll();
}

function removeItem(itemId) {
  const session = getSession();
  const room = loadRoom(session.roomCode);
  if (!room) return;

  const item = room.items.find((i) => i.id === itemId);
  if (!item) return;

  room.items = room.items.filter((i) => i.id !== itemId);
  room.activityLog.push({
    user: session.userName,
    action: `removed ${item.name}`,
    time: Date.now(),
  });

  saveRoom(room);
  renderAll();
}

function renderCart() {
  const session = getSession();
  const room = loadRoom(session.roomCode);
  if (!room) return;

  const tbody = document.getElementById("cartTableBody");
  const emptyEl = document.getElementById("emptyCart");
  const tableEl = tbody.closest("table");
  const countEl = document.getElementById("itemCount");
  const totalEl = document.getElementById("grandTotal");

  tbody.innerHTML = "";

  if (room.items.length === 0) {
    emptyEl.style.display = "block";
    tableEl.style.display = "none";
  } else {
    emptyEl.style.display = "none";
    tableEl.style.display = "table";

    let total = 0;

    room.items.forEach((item) => {
      const subtotal = item.price * item.qty;
      total += subtotal;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${escapeHtml(item.name)}</td>
        <td class="text-end">${formatCurrency(item.price)}</td>
        <td class="text-center">${item.qty}</td>
        <td class="text-end">${formatCurrency(subtotal)}</td>
        <td><span class="badge bg-secondary">${escapeHtml(item.addedBy)}</span></td>
        <td class="text-center no-print">
          <button class="btn btn-sm btn-outline-danger" onclick="removeItem(${item.id})">X</button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    totalEl.textContent = formatCurrency(total);
  }

  const totalQty = room.items.reduce((sum, i) => sum + i.qty, 0);
  countEl.textContent = `${totalQty} item${totalQty !== 1 ? "s" : ""}`;

  updateProgress(room);
  renderMembers(room);
}

function updateProgress(room) {
  const total = room.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const bar = document.getElementById("progressBar");
  const text = document.getElementById("progressText");

  let percent = Math.min((total / FREE_DELIVERY_THRESHOLD) * 100, 100);
  bar.style.width = percent + "%";

  if (total >= FREE_DELIVERY_THRESHOLD) {
    bar.className = "progress-bar bg-success";
    text.textContent = `Free delivery unlocked! (${formatCurrency(total)})`;
  } else {
    bar.className = "progress-bar bg-warning";
    const remaining = FREE_DELIVERY_THRESHOLD - total;
    text.textContent = `${formatCurrency(total)} / ${formatCurrency(FREE_DELIVERY_THRESHOLD)} - add ${formatCurrency(remaining)} more`;
  }
}

function renderMembers(room) {
  const list = document.getElementById("memberList");
  const session = getSession();
  list.innerHTML = "";

  const header = document.createElement("li");
  header.className = "mb-2";
  header.innerHTML = `<strong>Total: ${room.members.length} member${room.members.length !== 1 ? "s" : ""}</strong>`;
  list.appendChild(header);

  room.members.forEach((m) => {
    const li = document.createElement("li");
    li.className = "d-flex align-items-center justify-content-between py-1";

    let badges = "";

    if (m === room.createdBy) {
      badges += `<span class="badge bg-warning text-dark ms-1">Creator</span>`;
    }

    if (m === session.userName) {
      badges += `<span class="badge bg-success ms-1">You</span>`;
    }

    li.innerHTML = `
      <span>${escapeHtml(m)}</span>
      <span>${badges}</span>
    `;
    list.appendChild(li);
  });
}

function printReceipt() {
  const session = getSession();
  const room = loadRoom(session.roomCode);
  if (!room || room.items.length === 0) {
    alert("Cart is empty. Nothing to print.");
    return;
  }

  document.getElementById("printRoomCode").textContent = room.roomCode;
  document.getElementById("printDate").textContent = new Date().toLocaleString(
    "en-IN"
  );

  const printBody = document.getElementById("printTableBody");
  printBody.innerHTML = "";

  let grandTotal = 0;
  const perPerson = {};

  room.items.forEach((item) => {
    const subtotal = item.price * item.qty;
    grandTotal += subtotal;

    perPerson[item.addedBy] = (perPerson[item.addedBy] || 0) + subtotal;

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(item.name)}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>${item.qty}</td>
      <td>${formatCurrency(subtotal)}</td>
      <td>${escapeHtml(item.addedBy)}</td>
    `;
    printBody.appendChild(tr);
  });

  document.getElementById("printGrandTotal").textContent =
    formatCurrency(grandTotal);

  const splitList = document.getElementById("printSplitList");
  splitList.innerHTML = "";
  Object.keys(perPerson).forEach((person) => {
    const li = document.createElement("li");
    li.textContent = `${person}: ${formatCurrency(perPerson[person])}`;
    splitList.appendChild(li);
  });

  window.print();
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}