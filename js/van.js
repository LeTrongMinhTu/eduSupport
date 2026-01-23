const selects = document.querySelectorAll(".electric");

// Duyệt qua từng select để gắn sự kiện onchange
selects.forEach(select => {
  select.addEventListener("change", () => {
    const value = select.value;
    if (value) {
      // Chuyển hướng đến đường link được chọn
      window.location.href = value;
    }
  });
});
//Dark/light
function toggleMode() {
  document.body.classList.toggle("dark");
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
}
//Music
function toggleMusic() {
  let audio = document.getElementById("bgMusic");
  let musicBtn = document.getElementById("musicBtn");

  if (audio.paused) {
    audio.play();
    localStorage.setItem("musicOn", "true");
    if (musicBtn) musicBtn.innerText = "🔊";
  } else {
    audio.pause();
    localStorage.setItem("musicOn", "false");
    if (musicBtn) musicBtn.innerText = "🔇";
  }
}
const searchInput = document.getElementById("search");

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    handleSearch();
  }
});

function handleSearch() {
  const value = searchInput.value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "");

  const map = {
    "mởđầu": "mo-dau",
    "mobai": "mo-dau",

    "vănmẫu": "mot-so-bai-van-mau",
    "vanmau": "mot-so-bai-van-mau",

    "tậptrung": "che-do-tap-trung",
    "taptrung": "che-do-tap-trung",

    "cảmhứng": "thu-vien-cam-hung",
    "camhung": "thu-vien-cam-hung",

    "chatbot": "ptbv"
  };

  if (map[value]) {
    document
      .getElementById(map[value])
      .scrollIntoView({ behavior: "smooth" });
  } else {
    alert("Không tìm thấy nội dung phù hợp");
  }
}

