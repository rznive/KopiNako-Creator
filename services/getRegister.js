const axios = require("axios");
const chalk = require("chalk");

async function completeRegister(userData, otp) {
  const data = JSON.stringify({
    ...userData,
    otp,
  });

  const config = {
    method: "POST",
    url: "https://landing-nako.stamps.co.id/api/auth/register",
    headers: {
      "User-Agent": "okhttp/4.12.0",
      "Accept-Encoding": "gzip",
      authorization: "token dLzZDjYo71l2a3b04DI1VddaUiegcIX3EsBiO3VG",
      "content-type": "application/json; charset=utf-8",
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    console.log(chalk.green.bold("🎉 Registrasi berhasil!"));
    console.log("Respon:", response.data);
  } catch (error) {
    console.error(chalk.red.bold("❌ Gagal menyelesaikan registrasi."));
    console.error(error.response ? error.response.data : error.message);
  }
}

module.exports = { completeRegister };
