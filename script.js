const now = new Date().toISOString();

navigator.geolocation.getCurrentPosition((pos) => {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;

  document.getElementById("status").textContent = `位置情報取得成功：${lat}, ${lng}`;

  document.getElementById("appForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const action = document.getElementById("actionInput").value;

    const data = {
      tag: action,
      lat: lat,
      lng: lng,
      timestamp: new Date().toISOString()
    };

    await fetch("https://sharetravelinfolikedq-default-rtdb.firebaseio.com/logs.json", {
      method: "POST",
      body: JSON.stringify(data)
    });

    alert("送信完了！");
    location.reload();
  });

}, () => {
  document.getElementById("status").textContent = "位置情報の取得に失敗しました。";
});

fetch("https://sharetravelinfolikedq-default-rtdb.firebaseio.com/logs.json")
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById("logContainer");
    for (let id in data) {
      const entry = data[id];
      const div = document.createElement("div");
      div.className = "log-entry";
      div.innerHTML = `
        <strong>${entry.timestamp}</strong><br>
        ${entry.tag}<br>
        緯度: ${entry.lat}<br>
        経度: ${entry.lng}
      `;
      container.appendChild(div);
    }
  });