// ================== Menu Dropdown ==================
const menuBtn = document.getElementById("menuBtn");
const menuList = document.getElementById("menuList");

// Toggle menu khi bấm nút
menuBtn.addEventListener("click", () => {
  menuList.classList.toggle("show");
});

// Đóng menu nếu click ra ngoài
window.addEventListener("click", (e) => {
  if (!e.target.matches("#menuBtn")) {
    menuList.classList.remove("show");
  }
});

// Hàm mở trang mới
function openSubject(url) {
  window.open(url, "_blank");
  menuList.classList.remove("show");
}

// ================== Thời gian học ==================
let timenow = Date.now();

window.addEventListener("beforeunload", function () {
  let timeend = Date.now();
  let timespent = (timeend - timenow) / 1000 / 60 / 60;
  let hours = parseFloat(localStorage.getItem("hours")) || 0;
  hours += timespent;
  localStorage.setItem("hours", hours);
});

// ================== Goals ==================
function markGoal(goalId) {
  localStorage.setItem("goal-" + goalId, "done");
  let li = document.getElementById("goal-" + goalId);
  if (li && !li.innerText.includes("✅")) {
    li.innerHTML = li.innerText + " ✅";
  }
}

function updateGoals() {
  ["ghichu", "tkb", "tonghop", "cauhoi"].forEach(goalId => {
    let li = document.getElementById("goal-" + goalId);
    if (localStorage.getItem("goal-" + goalId) === "done") {
      li.innerHTML = li.innerText.replace("✅", "") + " ✅";
    }
  });
}

// ================== Bảng thành tích ==================
function updateStats() {
  let hours = parseFloat(localStorage.getItem("hours")) || 0;
  document.getElementById("hours").innerText = hours.toFixed(2);

  // tính điểm: mỗi 0.17h ~ 10 phút = 1 điểm
  let points = Math.floor(hours / 0.17);
  localStorage.setItem("points", points);
  document.getElementById("points").innerText = points;

  // badges
  let badgeBox = document.getElementById("badges");
  badgeBox.innerHTML = "";
  if (hours >= 5) badgeBox.innerHTML += "<span>🏅 5h</span>";
  if (hours >= 10) badgeBox.innerHTML += "<span>🎖️ 10h</span>";
  if (hours >= 20) badgeBox.innerHTML += "<span>🥇 20h</span>";

  // goals done
  let goals = ["ghichu", "tkb", "tonghop", "cauhoi"];
  let done = goals.filter(id => localStorage.getItem("goal-" + id) === "done").length;
  document.getElementById("goals-done").innerText = done + "/" + goals.length;

  // progress bar
  let percent = (done / goals.length) * 100;
  document.getElementById("progress-bar").style.width = percent + "%";
}

function resetProgress() {
  if (confirm("Bạn có chắc chắn muốn làm lại từ đầu không?")) {
    localStorage.clear();
    location.reload();
  }
}

// ================== Thống kê học tập (Chart.js) ==================
function renderChart() {
    let ctx = document.getElementById("studyChart").getContext("2d");

    // Lấy lịch sử
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let today = new Date().toLocaleDateString("vi-VN");

    let hours = parseFloat(localStorage.getItem("hours")) || 0;

    // cập nhật ngày mới
    let entry = history.find(h => h.date === today);
    if (!entry) {
        history.push({ date: today, hours: hours });
        localStorage.setItem("history", JSON.stringify(history));
    }

    let labels = history.map(h => h.date);
    let data = history.map(h => h.hours);

    // 🎨 Tạo gradient màu vàng → cam → đỏ
    let gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, "rgba(255, 215, 0, 0.9)");
    gradient.addColorStop(0.5, "rgba(255, 165, 0, 0.7)");
    gradient.addColorStop(1, "rgba(255, 69, 0, 0.5)");

    new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Tổng giờ học",
                data: data,
                
                borderColor: "gold",
                borderWidth: 3,

                backgroundColor: gradient,
                fill: true,
                tension: 0.35,

                pointBackgroundColor: "#fff",
                pointBorderColor: "gold",
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBorderWidth: 2,
            }]
        },

        options: {
            responsive: true,
            animation: {
                duration: 900,
                easing: "easeOutQuart"
            },

            plugins: {
                legend: {
                    labels: {
                        color: "#fff",
                        font: { size: 16 }
                    }
                },

                tooltip: {
                    backgroundColor: "rgba(0,0,0,0.7)",
                    titleColor: "#FFD700",
                    bodyColor: "#fff",
                    borderColor: "gold",
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: "#fff",
                        font: { size: 14 }
                    },
                    grid: {
                        color: "rgba(255,255,255,0.1)"
                    }
                },

                y: {
                    ticks: {
                        color: "#fff",
                        font: { size: 14 }
                    },

                    // max tự động + 1 để không bị đè sát trần
                    suggestedMax: Math.max(...data) + 1,

                    grid: {
                        color: "rgba(255,255,255,0.1)"
                    }
                }
            }
        }
    });
}

// ================== Feedback ==================
emailjs.init("Y3_dDFsNkgVihFEED");
function sendFeedback() {
  const text = document.getElementById("feedbackInput").value;
  const status = document.getElementById("feedbackStatus");

  if (!text.trim()) {
      status.innerText = "❌ Vui lòng nhập feedback";
      return;
  }

  emailjs.send(
      "service_v5i4yfi",
      "template_zc7lpu5",
      {
      message: text,
      page: window.location.href,
      time: new Date().toLocaleString()
      }
  ).then(() => {
      status.innerText = "✅ Đã gửi feedback thành công!";
      document.getElementById("feedbackInput").value = "";
  }).catch(err => {
      status.innerText = "❌ Gửi thất bại!";
      console.error(err);
  });
}

// ================== Init ==================
window.addEventListener("load", () => {
  updateGoals();
  updateStats();
  renderChart();

  // giữ dark mode khi reload
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark");
  }

  // giữ trạng thái nhạc khi reload
  let audio = document.getElementById("bgMusic");
  let musicBtn = document.getElementById("musicBtn");
  if (localStorage.getItem("musicOn") === "true") {
    audio.play();
    if (musicBtn) musicBtn.innerText = "🔊";
  } else {
    if (musicBtn) musicBtn.innerText = "🔇";
  }

  // hiển thị giờ học
  let hours = parseFloat(localStorage.getItem("hours")) || 0;
  let hoursEl = document.getElementById("hours");
  if (hoursEl) hoursEl.innerText = hours.toFixed(2);
});