import mineflayer from "mineflayer";
import express from "express";

const app = express();

// صفحة الفحص لـ uptime robot
app.get("/", (req, res) => {
  console.log("🌐 Ping received from uptime monitor");
  res.send("Bot is running!");
});

// =============================
// ✔️ تعديل Replit (مهم جداً)
// =============================
const port = process.env.PORT || 3000;

app.listen(port, "0.0.0.0", () => {
  console.log(`🌐 Web server running on port ${port}`);
});

// =============================
// تشغيل البوت
// =============================
function startBot() {
  console.log("🤖 ...محاولة تشغيل البوت");

  const bot = mineflayer.createBot({
    host: "ameer123123.aternos.me",
    port: 22301,
    username: "BotAFK",
    version: false,
  });

  bot.once("spawn", () => {
    console.log("✅ البوت دخل السيرفر بنجاح!");
  });

  // =============================
  // ✔️ إضافة أمر !tp هنا
  // =============================
  bot.on("chat", async (username, message) => {
    if (username === bot.username) return;

    if (message === "!tp") {
      const target = bot.players[username]?.entity;

      if (!target) {
        bot.chat("ما اقدر احدد مكانك 🚫");
        return;
      }

      const pos = target.position;

      try {
        await bot.teleport(pos);
        bot.chat("✨ تم التيلبورت لعندك!");
        console.log(`➡️ تيلبورت إلى ${username}`);
      } catch (err) {
        bot.chat("❌ في خطأ بالتيلبورت!");
        console.log(err);
      }
    }
  });
  // =============================

  // حركة AFK
  setInterval(() => {
    const moves = ["forward", "back", "left", "right"];
    const move = moves[Math.floor(Math.random() * moves.length)];

    try {
      bot.setControlState(move, true);
      setTimeout(() => bot.setControlState(move, false), 800);
      console.log("➡️ تحرك:", move);
    } catch (err) {
      console.log("❌ خطأ أثناء الحركة:", err);
    }
  }, 5000);

  bot.on("end", () => {
    console.log("⚠️ انفصل الاتصال! إعادة التشغيل بعد 5 ثوان...");
    setTimeout(startBot, 5000);
  });

  bot.on("error", (err) => {
    console.log("❌ Error:", err);
  });
}

startBot();