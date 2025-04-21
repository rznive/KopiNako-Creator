const axios = require("axios");
const chalk = require("chalk");

async function requestOtp(userData) {
  const data = JSON.stringify({
    name: userData.name,
    mobile_number: userData.mobile_number,
    password: userData.password,
    email: userData.email,
    referral_code: userData.referral_code || "",
  });

  const config = {
    method: "POST",
    url: "https://landing-nako.stamps.co.id/api/auth/validate-register-identifier",
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
    console.log(chalk.green.bold("✅ OTP berhasil dikirim!"));
    console.log("Respon:", response.data);
  } catch (error) {
    console.error(chalk.red.bold("❌ Gagal mengirim OTP."));
    console.error(error.response ? error.response.data : error.message);
  }
}

module.exports = { requestOtp };
