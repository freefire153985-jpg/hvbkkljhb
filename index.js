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
// 🔁 تشغيل البوت مع إعادة المحاولة كل 5 ثواني
// =============================
function startBot() {
  console.log("🤖 محاولة تشغيل البوت...");

  let bot;

  try {
    bot = mineflayer.createBot({
      host: "ameer123123.aternos.me",
      port: 22301,
      username: "BotAFK",
      version: false,
    });
  } catch (err) {
    console.log("❌ السيرفر مغلق... إعادة المحاولة بعد 5 ثواني");
    return setTimeout(startBot, 5000);
  }

  // عند تسجيل الدخول
  bot.on("login", () => {
    console.log("🔓 تم الاتصال بالسيرفر (Login)");
  });

  // عند الدخول للعبة
  bot.once("spawn", () => {
    console.log("✅ دخل السيرفر بنجاح!");
    bot.chat("🤖 عدت للعمل!");
  });

  // =============================
  // ✔️ أمر !tp
  // =============================
  bot.on("chat", async (username, message) => {
    if (username === bot.username) return;

    if (message === "!tp") {
      const target = bot.players[username]?.entity;

      if (!target) {
        bot.chat("🚫 ما اقدر احدد مكانك");
        return;
      }

      const pos = target.position;

      try {
        await bot.teleport(pos);
        bot.chat("✨ تم التيلبورت!");
        console.log(`➡️ تيلبورت إلى ${username}`);
      } catch (err) {
        bot.chat("❌ خطأ بالتيلبورت!");
        console.log(err);
      }
    }
  });

  // =============================
  // 🛡️ أقوى Anti-AFK
  // =============================

  // 1 — حركة اتجاهات
  setInterval(() => {
    const moves = ["forward", "back", "left", "right"];
    const move = moves[Math.floor(Math.random() * moves.length)];

    bot.setControlState(move, true);
    setTimeout(() => bot.setControlState(move, false), 700);

    console.log("🚶 حركة:", move);
  }, 4000);

  // 2 — قفزات
  setInterval(() => {
    bot.setControlState("jump", true);
    setTimeout(() => bot.setControlState("jump", false), 250);
    console.log("🦘 Jump!");
  }, 8000);

  // 3 — ضرب
  setInterval(() => {
    bot.swingArm();
    console.log("✊ Swing!");
  }, 6000);

  // 4 — دوران كاميرا
  setInterval(() => {
    const yaw = bot.entity.yaw + (Math.random() * 2 - 1);
    bot.look(yaw, 0, true);
    console.log("👀 Look rotation");
  }, 7000);

  // 5 — رسالة AFK
  setInterval(() => {
    bot.chat("🤖 AFK");
  }, 60000);

  // =============================
  // 🔄 Auto Reconnect + Retry
  // =============================
  bot.on("end", () => {
    console.log("⚠️ الاتصال انقطع!");
    console.log("🔁 إعادة المحاولة بعد 5 ثواني...");
    setTimeout(startBot, 5000);
  });

  bot.on("kicked", (reason) => {
    console.log("❌ تم طرد البوت:", reason);
    console.log("🔁 إعادة المحاولة بعد 5 ثواني...");
    setTimeout(startBot, 5000);
  });

  bot.on("error", (err) => {
    console.log("❌ Error:", err.message);
    console.log("🔁 إعادة المحاولة بعد 5 ثواني...");
    setTimeout(startBot, 5000);
  });
}

startBot();
