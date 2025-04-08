// URLパラメータ取得
const params = new URLSearchParams(window.location.search);
const tag = params.get("tag") || "不明なアプリ";
document.getElementById("sourceTag").value = tag;

// 現在時刻
const now = new Date().toISOString();

// 位置情報取得 → Firebaseに送信
navigator.geolocation.getCurrentPosition((pos) => {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;

  document.getElementById("status").textContent = `位置情報取得成功：${lat}, ${lng}`;

  document.getElementById("appForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      tag: tag,
      lat: lat,
      lng: lng,
      timestamp: now
    };

    // Firebaseへ送信
    await fetch("https://sharetravelinfolikedq-default-rtdb.firebaseio.com/logs.json", {
      method: "POST",
      body: JSON.stringify(data)
    });

    alert("送信完了！");
  });

}, () => {
  document.getElementById("status").textContent = "位置情報の取得に失敗しました。";
});

// データを取得して一覧表示
fetch("https://sharetravelinfolikedq-default-rtdb.firebaseio.com/logs.json")
  .then(res => res.json())
  .then(data => {
    for (let id in data) {
      const entry = data[id];
      const div = document.createElement("div");
      div.textContent = `${entry.timestamp} - ${entry.tag} @ (${entry.lat}, ${entry.lng})`;
      document.body.appendChild(div);
    }
  });