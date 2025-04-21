const axios = require("axios");
const chalk = require("chalk");

async function loginAndGetSession(mobile_number, password) {
  try {
    const response = await axios.post(
      "https://landing-nako.stamps.co.id/api/auth/login",
      {
        mobile_number,
        password,
      },
      {
        headers: {
          "User-Agent": "okhttp/4.12.0",
          authorization: "token dLzZDjYo71l2a3b04DI1VddaUiegcIX3EsBiO3VG",
          "content-type": "application/json; charset=utf-8",
        },
        withCredentials: true,
      }
    );

    const userData = response.data.user;
    const setCookie = response.headers["set-cookie"];
    const sessionCookie = setCookie.find((cookie) =>
      cookie.includes("sessionid=")
    );
    const sessionId = sessionCookie.match(/sessionid=([^;]+)/)[1];

    const result = {
      user: userData,
      session: sessionId,
      auth_header: `session ${sessionId}`,
    };

    console.log(chalk.green.bold("\n✅ Login berhasil!"));
    console.log(JSON.stringify(result, null, 2));

    return sessionId;
  } catch (err) {
    console.error(chalk.red.bold("\n❌ Login gagal:"));
    console.error(err.response?.data || err.message);
    return null;
  }
}

async function getVouchers(sessionId) {
  try {
    const response = await axios.get(
      "https://nako.stamps.co.id/mobile-api/v2/vouchers/?include_template_groups=true",
      {
        headers: {
          "User-Agent": "okhttp/4.12.0",
          authorization: `session ${sessionId}`,
          Accept: "*/*",
          "Accept-Encoding": "gzip",
          Connection: "keep-alive",
        },
      }
    );

    console.log(chalk.yellow.bold("\n🎁 Voucher tersedia:"));
    console.log(JSON.stringify(response.data, null, 2));
  } catch (err) {
    console.error(chalk.red.bold("\n❌ Gagal ambil voucher:"));
    console.error(err.response?.data || err.message);
  }
}

module.exports = { loginAndGetSession, getVouchers };
