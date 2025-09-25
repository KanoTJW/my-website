// === Profile State ===
let exp = parseInt(localStorage.getItem("exp")) || 40;
let coins = parseInt(localStorage.getItem("coins")) || 70;
let level = parseInt(localStorage.getItem("level")) || 1;
let avatar = localStorage.getItem("avatar") || "avatars/Avatar.gif"; 
if (!avatar || avatar.endsWith(".png")) {
  avatar = "avatars/Avatar.gif";
  localStorage.setItem("avatar", avatar); // 更新存储
}
// 页面加载时直接执行 updateProfile + 渲染选择器
document.addEventListener("DOMContentLoaded", () => {
  updateProfile();
  renderAvatarSelect();
});

// === Update Profile ===
function updateProfile() {
  // 更新进度条
  document.getElementById("expBar").style.width = exp + "%";
  document.getElementById("coinBar").style.width = coins + "%";

  // 更新数字
  document.getElementById("expValue").innerText = exp;
  document.getElementById("coinsValue").innerText = coins;
  document.getElementById("level").innerText = "Level: " + level;

  // ✅ 更新头像
  const profileImg = document.getElementById("profileAvatar");
  if (profileImg) profileImg.src = avatar;

  // 存储
  localStorage.setItem("exp", exp);
  localStorage.setItem("coins", coins);
  localStorage.setItem("level", level);
  localStorage.setItem("avatar", avatar);
}


// === 设置新头像 ===
function setAvatar(newAvatarPath) {
  avatar = newAvatarPath;
  updateProfile();
  showAvatarChangedPopup();
}

// === 头像下拉选择 ===
function renderAvatarSelect() {
  const avatarSelect = document.getElementById("avatarSelect");
  if (!avatarSelect) return;

  const avatarOptions = [
    "avatars/Default Avatar.gif",
    "avatars/Avatar A.gif",
    "avatars/Avatar B.gif",
    "avatars/Avatar C.gif"
  ];

  avatarSelect.innerHTML = "";
  avatarOptions.forEach(path => {
    const option = document.createElement("option");
    option.value = path;
    option.textContent = path.split("/").pop();
    if (path === avatar) option.selected = true;
    avatarSelect.appendChild(option);
  });

  avatarSelect.addEventListener("change", (e) => {
    setAvatar(e.target.value);
  });
}

// === 显示头像更换提示 ===
function showAvatarChangedPopup() {
  let popup = document.getElementById("avatarPopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "avatarPopup";
    popup.style.position = "fixed";
    popup.style.bottom = "20px";
    popup.style.right = "20px";
    popup.style.background = "rgba(0,0,0,0.8)";
    popup.style.color = "#fff";
    popup.style.padding = "10px 16px";
    popup.style.borderRadius = "10px";
    popup.style.zIndex = "9999";
    popup.style.fontSize = "14px";
    popup.style.fontFamily = "sans-serif";
    document.body.appendChild(popup);
  }

  popup.innerText = "✅ Avatar 已更换！";
  popup.style.display = "block";

  setTimeout(() => {
    popup.style.display = "none";
  }, 1500);
}


// === 渲染头像选择器 ===
function renderAvatarSelect() {
  const avatarSelect = document.getElementById("avatarSelect");
  if (!avatarSelect) return;

  avatarSelect.innerHTML = "";
  ownedAvatars.forEach(path => {
    const option = document.createElement("option");
    option.value = path;
    option.textContent = path.split("/").pop().replace(".gif", "");
    if (path === avatar) option.selected = true;
    avatarSelect.appendChild(option);
  });

  avatarSelect.onchange = (e) => {
    setAvatar(e.target.value);
  };
}

// === Daily Sign-In ===
const signinBtn = document.getElementById("signinBtn");
const today = new Date().toDateString();
const lastSignIn = localStorage.getItem("lastSignIn");

if (signinBtn) {
  if (lastSignIn === today) {
    signinBtn.disabled = true;
    signinBtn.innerText = "✅ Already Signed In Today";
  }

  signinBtn.addEventListener("click", () => {
    exp += 10;
    coins += 20;
    if (exp >= 100) {
      exp -= 100;
      level++;
    }
    localStorage.setItem("lastSignIn", today);
    signinBtn.disabled = true;
    signinBtn.innerText = "✅ Already Signed In Today";
    updateProfile();
    showRewardPopup();
  });
}

// === Reward Popup ===
function showRewardPopup() {
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.left = "50%";
  popup.style.transform = "translateX(-50%)";
  popup.style.padding = "10px 20px";
  popup.style.background = "#4caf50";
  popup.style.color = "#fff";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
  popup.innerText = `+10 EXP, +20 Coins!`;
  document.body.appendChild(popup);
  setTimeout(() => { document.body.removeChild(popup); }, 2500);
}

// 初始化
updateProfile();



// === Theme Toggle ===
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");

// 初始化图标
if (document.body.classList.contains("light-mode")) {
  themeIcon.src = "sun.png";
} else {
  themeIcon.src = "moon.png";
}

// 点击切换主题
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light-mode");

  if (document.body.classList.contains("light-mode")) {
    themeIcon.src = "sun.png";  // light mode icon
  } else {
    themeIcon.src = "moon.png"; // dark mode icon
  }
});



// Init
updateProfile();

// === Universal Modal System ===
function openModal(title, contentHTML, onOk, onCancel) {
  const modal = document.getElementById("appModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalContent = document.getElementById("modalContent");
  const btnOk = document.getElementById("modalOk");
  const btnCancel = document.getElementById("modalCancel");

  modalTitle.textContent = title;
  modalContent.innerHTML = contentHTML;
  modal.style.display = "flex";

  // Focus on first input if exists
  setTimeout(() => {
    const firstInput = modalContent.querySelector('input, textarea, select');
    if (firstInput) firstInput.focus();
  }, 100);

  btnOk.onclick = () => {
    if (onOk) onOk();
    modal.style.display = "none";
  };

  btnCancel.onclick = () => {
    if (onCancel) onCancel();
    modal.style.display = "none";
  };

  // Close on overlay click
  modal.onclick = (e) => {
    if (e.target === modal) {
      if (onCancel) onCancel();
      modal.style.display = "none";
    }
  };
}

// Custom alert function using modal
function customAlert(message, title = "Alert") {
  openModal(title, `<p>${message}</p>`, null, null);
}

// === Timetable Feature ===
const timetableTable = document.querySelector("#timetableTable tbody");
let timetableData = JSON.parse(localStorage.getItem("timetable")) || [];

// Render Timetable
function renderTimetable() {
  timetableTable.innerHTML = "";
  timetableData.forEach((row, index) => {
    const tr = document.createElement("tr");

    const tdDay = document.createElement("td");
    const tdSub = document.createElement("td");
    const tdTime = document.createElement("td");
    const tdPlace = document.createElement("td");

    tdDay.innerHTML = `<input type="text" value="${row.day}" oninput="updateRow(${index}, 'day', this.value)">`;
    tdSub.innerHTML = `<input type="text" value="${row.subject}" oninput="updateRow(${index}, 'subject', this.value)">`;
    tdTime.innerHTML = `<input type="text" value="${row.time}" oninput="updateRow(${index}, 'time', this.value)">`;
    tdPlace.innerHTML = `<input type="text" value="${row.place}" oninput="updateRow(${index}, 'place', this.value)">`;

    tr.appendChild(tdDay);
    tr.appendChild(tdSub);
    tr.appendChild(tdTime);
    tr.appendChild(tdPlace);
    timetableTable.appendChild(tr);
  });
  localStorage.setItem("timetable", JSON.stringify(timetableData));
}

// Add Row
function addRow() {
  timetableData.push({ day: "", subject: "", time: "" , place: "" });
  renderTimetable();
}

// Delete Row
function deleteRow() {
  timetableData.pop();
  renderTimetable();
}

// Update Row
function updateRow(index, field, value) {
  timetableData[index][field] = value;
  localStorage.setItem("timetable", JSON.stringify(timetableData));
}

// Init Timetable
renderTimetable();

// === Daily Planner ===
const planner = document.getElementById("plannerContainer");
let plannerData = JSON.parse(localStorage.getItem("plannerData")) || {};

function savePlanner() {
  localStorage.setItem("plannerData", JSON.stringify(plannerData));
}

function renderPlanner() {
  planner.innerHTML = "";
  for (let hour = 0; hour < 24; hour++) {
    const row = document.createElement("div");
    row.className = "planner-row";

    const timeLabel = document.createElement("div");
    timeLabel.className = "time-label";
    timeLabel.textContent = hour.toString().padStart(2, "0") + ":00";

    const taskCell = document.createElement("div");
    taskCell.className = "task-cell";
    taskCell.dataset.hour = hour;

    if (plannerData[hour]) {
      const { text, tag, done } = plannerData[hour];
      taskCell.innerHTML = `
        <span class="task-text ${done ? "done" : ""} tag-${tag}">
          <span class="tag-dot tag-${tag}"></span> ${text}
        </span>
        <div class="task-actions">
          <button class="toggle-btn">${done ? "✅" : "⬜"}</button>
          <button class="edit-btn">✏️</button>
          <button class="delete-btn">🗑️</button>
        </div>
      `;

      // Toggle 完成状态
      taskCell.querySelector(".toggle-btn").onclick = () => {
        plannerData[hour].done = !plannerData[hour].done;
        savePlanner();
        renderPlanner();
      };
      // 编辑
      taskCell.querySelector(".edit-btn").onclick = () => {
        openTaskForm(hour, plannerData[hour]);
      };
      // 删除
      taskCell.querySelector(".delete-btn").onclick = () => {
        delete plannerData[hour];
        savePlanner();
        renderPlanner();
      };
    } else {
      taskCell.innerHTML = `<span class="empty">Double-click to add task...</span>`;
    }

    // 双击新增任务
    taskCell.onclick = () => {
      openTaskForm(hour, plannerData[hour]);
    };

    row.appendChild(timeLabel);
    row.appendChild(taskCell);
    planner.appendChild(row);
  }
}

// 打开任务编辑表单 - Updated to use modal
function openTaskForm(hour, task = null) {
  const defaultText = task ? task.text : "";
  const defaultTag = task ? task.tag : "work";

  const content = `
    <label>Task:</label>
    <input id="taskInput" type="text" value="${defaultText}" placeholder="Enter task description...">
    
    <label>Category:</label>
    <select id="taskTag">
      <option value="work" ${defaultTag==="work"?"selected":""}>🔴 Work</option>
      <option value="study" ${defaultTag==="study"?"selected":""}>🔵 Study</option>
      <option value="rest" ${defaultTag==="rest"?"selected":""}>🟢 Rest</option>
      <option value="other" ${defaultTag==="other"?"selected":""}>⚪ Other</option>
    </select>
  `;

  openModal(`${task ? 'Edit' : 'Add'} Task - ${hour.toString().padStart(2, "0")}:00`, content, () => {
    const text = document.getElementById("taskInput").value.trim();
    const tag = document.getElementById("taskTag").value;
    if (text === "") {
      delete plannerData[hour];
    } else {
      plannerData[hour] = { text, tag, done: task ? task.done : false };
    }
    savePlanner();
    renderPlanner();
  });
}

// 初始化
renderPlanner();

// === Calendar Feature ===
const calendarContainer = document.getElementById("calendarContainer");
const monthYearLabel = document.getElementById("calendarMonthYear");
const monthPicker = document.getElementById("monthPicker");
const notesOutput = document.getElementById("notes-output");

let calendarNotes = JSON.parse(localStorage.getItem("calendarNotes")) || {};
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth();

function renderCalendar(year = currentYear, month = currentMonth) {
  calendarContainer.innerHTML = "";

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  daysOfWeek.forEach(d => {
    const div = document.createElement("div");
    div.textContent = d;
    div.classList.add("calendar-header");
    calendarContainer.appendChild(div);
  });

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // 空白填充
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    calendarContainer.appendChild(empty);
  }

  // 日期格子
  for (let day = 1; day <= lastDate; day++) {
    const div = document.createElement("div");
    div.textContent = day;
    div.classList.add("calendar-day");

    const key = `${year}-${month + 1}-${day}`;
    if (calendarNotes[key]) {
      div.classList.add("has-note");
    }

    div.onclick = () => {
      openCalendarNoteForm(key, calendarNotes[key] || "");
    };

    calendarContainer.appendChild(div);
  }

  // 更新 label & picker
  monthYearLabel.textContent = `${year}-${month + 1}`;
  monthPicker.value = `${year}-${String(month + 1).padStart(2, "0")}`;
}

// Calendar note form - Updated to use modal
function openCalendarNoteForm(dateKey, existingNote) {
  const content = `
    <label>Note for ${dateKey}:</label>
    <textarea id="calendarNoteInput" rows="4" placeholder="Enter your note for this date...">${existingNote}</textarea>
  `;

  openModal(`📝 Calendar Note`, content, () => {
    const note = document.getElementById("calendarNoteInput").value.trim();
    if (note === "") {
      delete calendarNotes[dateKey];
    } else {
      calendarNotes[dateKey] = note;
    }
    localStorage.setItem("calendarNotes", JSON.stringify(calendarNotes));
    renderCalendar(currentYear, currentMonth);
    renderNotesList();
  });
}

// Notes 列表
function renderNotesList() {
  notesOutput.innerHTML = "";
  Object.entries(calendarNotes).forEach(([date, content]) => {
    const li = document.createElement("li");
    li.textContent = `${date}: ${content}`;
    notesOutput.appendChild(li);
  });
}

// 切换月份
document.getElementById("prevMonth").onclick = () => {
  currentMonth--;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar(currentYear, currentMonth);
};
document.getElementById("nextMonth").onclick = () => {
  currentMonth++;
  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  renderCalendar(currentYear, currentMonth);
};
monthPicker.onchange = (e) => {
  const [y, m] = e.target.value.split("-").map(Number);
  currentYear = y;
  currentMonth = m - 1;
  renderCalendar(currentYear, currentMonth);
};

// Init
renderCalendar();
renderNotesList();

// === Links Dashboard ===
const linksGrid = document.getElementById("linksGrid");
let linksData = JSON.parse(localStorage.getItem("links")) || [];

function renderLinks() {
  linksGrid.innerHTML = "";
  linksData.forEach((link, index) => {
    const div = document.createElement("div");
    div.classList.add("link-card");
    div.innerHTML = `
      <a href="${link.url}" target="_blank">${link.name}</a>
      <button onclick="deleteLink(${index})">🗑️ Delete</button>
    `;
    linksGrid.appendChild(div);
  });
}

function addLink() {
  const name = document.getElementById("linkName").value.trim();
  const url = document.getElementById("linkURL").value.trim();
  if (name && url) {
    linksData.push({ name, url });
    localStorage.setItem("links", JSON.stringify(linksData));
    renderLinks();
    document.getElementById("linkName").value = "";
    document.getElementById("linkURL").value = "";
  } else {
    customAlert("Please enter both name and URL!", "Missing Information");
  }
}

function deleteLink(index) {
  const link = linksData[index];
  const content = `<p>Are you sure you want to delete "<strong>${link.name}</strong>"?</p>`;
  
  openModal("Confirm Delete", content, () => {
    linksData.splice(index, 1);
    localStorage.setItem("links", JSON.stringify(linksData));
    renderLinks();
  });
}

// Init Links
renderLinks();

// === Notes ===
const notesList = document.getElementById("notesList");
let notesData = JSON.parse(localStorage.getItem("notes")) || [];

function renderNotes() {
  notesList.innerHTML = "";
  notesData.forEach((note, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${note}</span>
      <button onclick="deleteNote(${index})">🗑️ Delete</button>
    `;
    notesList.appendChild(li);
  });
}

function addNote() {
  const noteInput = document.getElementById("noteInput");
  const note = noteInput.value.trim();
  if (note) {
    notesData.push(note);
    localStorage.setItem("notes", JSON.stringify(notesData));
    renderNotes();
    noteInput.value = "";
  } else {
    customAlert("Note cannot be empty!", "Empty Note");
  }
}

function deleteNote(index) {
  const note = notesData[index];
  const content = `<p>Are you sure you want to delete this note?</p><p><em>"${note}"</em></p>`;
  
  openModal("Confirm Delete", content, () => {
    notesData.splice(index, 1);
    localStorage.setItem("notes", JSON.stringify(notesData));
    renderNotes();
  });
}

// Init Notes
renderNotes();

// === Shop ===
const shopItems = document.getElementById("shopItems");

// 定义商品（加上头像路径）
const items = [
  { id: 1, name: "Avatar A", type: "avatar", cost: 60, img: "avatars/Avatar A.gif" },
  { id: 2, name: "Avatar B", type: "avatar", cost: 60, img: "avatars/Avatar B.gif" },
  { id: 3, name: "Avatar C", type: "avatar", cost: 60, img: "avatars/Avatar C.gif" },
  { id: 4, name: "Avatar D", type: "avatar", cost: 60, img: "avatars/Avatar D.gif" },
  { id: 5, name: "EXP Boost (5 min)", type: "expBoost", cost: 30, img: "exp.png" },
  { id: 6, name: "Coin Boost (5 min)", type: "coinBoost", cost: 30, img: "coin.png" }
];

// 已拥有的头像（从 localStorage 读取）
let ownedAvatars = JSON.parse(localStorage.getItem("ownedAvatars")) || ["avatars/Avatar.gif"];

// 渲染商店
function renderShop() {
  shopItems.innerHTML = "";
  items.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("shop-item");

    let extraHTML = "";
    if (item.img) { 
      // 根据类型设置不同 class
      const imgClass = item.type === "avatar" ? "shop-avatar" : "shop-boost-img";
      extraHTML = `<img src="${item.img}" alt="${item.name}" class="${imgClass}">`;
    }

    // 判断是否已拥有（只针对头像）
    const isOwned = item.type === "avatar" && ownedAvatars.includes(item.img);

    div.innerHTML = `
      <h4>${item.name}</h4>
      <p>Cost: ${item.cost} 🪙</p>
      ${extraHTML}
      <button onclick="buyItem(${item.id})" ${isOwned ? "disabled" : ""}>
        ${isOwned ? "Owned ✅" : "Buy"}
      </button>
    `;
    shopItems.appendChild(div);
  });
}


// 购买逻辑
function buyItem(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;

  if (coins < item.cost) {
    customAlert("Not enough coins!", "Purchase Failed");
    return;
  }

  const content = `
    <p>Do you want to buy <strong>${item.name}</strong> for ${item.cost} coins?</p>
    <p>Your current coins: ${coins}</p>
  `;

  openModal("Confirm Purchase", content, () => {
    coins -= item.cost;
    localStorage.setItem("coins", coins);

    let successMessage = "";
    if (item.type === "avatar") {
      // 添加到已拥有
      if (!ownedAvatars.includes(item.img)) {
        ownedAvatars.push(item.img);
        localStorage.setItem("ownedAvatars", JSON.stringify(ownedAvatars));
      }
      // 应用头像
      setAvatar(item.img);
      successMessage = `✅ Avatar changed to ${item.name}!`;
    } 
    else if (item.type === "expBoost") {
      localStorage.setItem("expBoost", Date.now() + 5 * 60 * 1000);
      successMessage = "⚡ EXP Boost activated for 5 minutes!";
    }
    else if (item.type === "coinBoost") {
      localStorage.setItem("coinBoost", Date.now() + 5 * 60 * 1000);
      successMessage = "💰 Coin Boost activated for 5 minutes!";
    }

    updateProfile();  // ✅ 更新 Profile 面板
    renderShop();     // ✅ 重新渲染商店（显示 Owned 状态）
    customAlert(successMessage, "Purchase Successful");
  });
}

// 初始化商店
renderShop();



const widthToggle = document.getElementById("widthToggle");
const widthIcon = document.getElementById("widthIcon");

// 初始化图标
if (localStorage.getItem("wideMode") === "true") {
  document.body.classList.add("wide-mode");
  widthIcon.src = "zoom in.png";  // 窄屏图标
} else {
  widthIcon.src = "zoom out.png"; // 宽屏图标
}

// 点击切换宽窄模式
widthToggle.addEventListener("click", () => {
  document.body.classList.toggle("wide-mode");
  const isWide = document.body.classList.contains("wide-mode");
  localStorage.setItem("wideMode", isWide);

  widthIcon.src = isWide ? "zoom in.png" : "zoom out.png";

  // 添加过渡动画
  widthIcon.style.transform = "rotate(0deg)";
  setTimeout(() => {
    widthIcon.style.transform = "rotate(360deg)";
  }, 50);
});



const nav = document.getElementById("topNav");
const banner = document.getElementById("topBanner");
let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  const bannerHeight = banner.offsetHeight;

  if (currentScroll > lastScrollY) {
    // 向下滚动 → banner 收起，nav 移动到顶部
    nav.style.top = "0";
    banner.style.transform = `translateY(-${bannerHeight}px)`;
  } else {
    // 向上滚动 → banner 展开，nav 回到原位
    nav.style.top = "0";
    banner.style.transform = `translateY(0)`;
  }

  lastScrollY = currentScroll;
});

const bannerUpload = document.getElementById("bannerUpload");
const topBanner = document.getElementById("topBanner");

bannerUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = function(ev) {
      const base64 = ev.target.result;
      topBanner.style.backgroundImage = `url(${base64})`;
      topBanner.style.backgroundSize = "cover";
      topBanner.style.backgroundPosition = "center";
      topBanner.innerHTML = ""; // 移除默认文字
  
      // 保存到 localStorage
      localStorage.setItem("customBanner", base64);
    };
    reader.readAsDataURL(file);
  });
  
  // 初始化时读取
  const savedBanner = localStorage.getItem("customBanner");
  if (savedBanner) {
    topBanner.style.backgroundImage = `url(${savedBanner})`;
    topBanner.style.backgroundSize = "cover";
    topBanner.style.backgroundPosition = "center";
    topBanner.innerHTML = "";
  }
  
const navButtons = document.querySelectorAll(".nav-btn");

navButtons.forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault(); // 阻止默认跳转

    // 获取对应 section
    const targetId = btn.getAttribute("href").substring(1);
    const targetSection = document.getElementById(targetId);

    // 平滑滚动到目标
    targetSection.scrollIntoView({ behavior: "smooth" });

    // 高亮动画
    navButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    // 可选：1 秒后恢复原色
    setTimeout(() => {
      btn.classList.remove("active");
    }, 1000);
  });
});

function showContent(sectionId) {
  const allContents = document.querySelectorAll(".content");
  
  allContents.forEach(c => {
    if (c.id === sectionId) {
      // 显示目标内容
      c.classList.remove("hidden");
    } else {
      // 隐藏其他内容
      c.classList.add("hidden");
    }
  });
}

// JS: 音乐播放器逻辑
const audio = document.getElementById("profileAudio");
const playPauseBtn = document.getElementById("playPauseBtn");
const musicStatus = document.getElementById("musicStatus");
const progressBar = document.getElementById("progressBar");
const currentTime = document.getElementById("currentTime");
const durationTime = document.getElementById("durationTime");
const volumeControl = document.getElementById("volumeControl");
const musicPlayerDiv = document.getElementById("profileMusicPlayer");

// 自动播放尝试
window.addEventListener("DOMContentLoaded", () => {
  audio.play().then(() => {
    musicPlayerDiv.classList.add("playing");
  }).catch(() => {
    musicStatus.textContent = "Autoplay blocked";
    playPauseBtn.textContent = "▶️";
  });
});

// 播放/暂停切换
playPauseBtn.addEventListener("click", () => {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸️";
    musicStatus.textContent = "Playing";
    musicPlayerDiv.classList.add("playing");
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶️";
    musicStatus.textContent = "Paused";
    musicPlayerDiv.classList.remove("playing");
  }
});

// 更新进度条和时间
audio.addEventListener("timeupdate", () => {
  const progressPercent = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progressPercent || 0;
  progressBar.style.backgroundImage = `linear-gradient(to right, rgba(255,255,255,0.8) ${progressPercent}%, rgba(255,255,255,0.3) ${progressPercent}%)`;
  currentTime.textContent = formatTime(audio.currentTime);
  durationTime.textContent = formatTime(audio.duration);
});

// 拖动进度条
progressBar.addEventListener("input", () => {
  audio.currentTime = (progressBar.value / 100) * audio.duration;
});

// 音量控制
volumeControl.addEventListener("input", () => {
  audio.volume = volumeControl.value;
});

// 时间格式化
function formatTime(sec) {
  if (isNaN(sec)) return "0:00";
  const minutes = Math.floor(sec / 60);
  const seconds = Math.floor(sec % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}



