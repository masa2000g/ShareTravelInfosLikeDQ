const now = new Date().toISOString();

// 位置情報取得
navigator.geolocation.getCurrentPosition((pos) => {
  const lat = pos.coords.latitude;
  const lng = pos.coords.longitude;

  document.getElementById("status").textContent = `位置情報取得成功：${lat}, ${lng}`;

  document.getElementById("appForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const memo = document.getElementById("actionInput").value;
    const category = document.getElementById("categorySelect").value;
    const amount = parseInt(document.getElementById("amountInput").value);

    if (!memo || !category || isNaN(amount)) {
      alert("すべての項目を正しく入力してください。");
      return;
    }

    const data = {
      memo: memo,
      amount_category: category,
      amount: amount,
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

// ログ表示
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
        メモ：${entry.memo}<br>
        カテゴリ：${entry.amount_category || "未設定"}<br>
        金額：¥${entry.amount || 0}<br>
        緯度：${entry.lat}<br>
        経度：${entry.lng}
      `;
      container.appendChild(div);
    }
  });