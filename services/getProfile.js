const axios = require("axios");
const chalk = require("chalk");

async function editProfile(name, email, sessionId) {
  const birthday = new Date().toISOString().split("T")[0]; // Mengambil tanggal hari ini dalam format YYYY-MM-DD

  const data = JSON.stringify({
    name: name,
    email: email,
    gender: 1,
    birthday: birthday, // Format tanggal yang diinginkan: YYYY-MM-DD
    instagram: "",
  });

  const config = {
    method: "POST",
    url: "https://landing-nako.stamps.co.id/api/auth/edit-profile",
    headers: {
      "User-Agent": "okhttp/4.12.0",
      "Accept-Encoding": "gzip",
      authorization: `session ${sessionId}`,
      "content-type": "application/json; charset=utf-8",
      Cookie: `csrftoken=x9VeKw4hD0xgnNGd5yJj5Wsk1Skf3AX8; sessionid=${sessionId}`,
    },
    data: data,
  };

  try {
    const response = await axios.request(config);
    console.log(chalk.green.bold("🎉 Profil berhasil diperbarui!"));
    console.log(response.data);
  } catch (error) {
    console.error(chalk.red("❌ Gagal memperbarui profil:"));
    console.error(error.response ? error.response.data : error.message);
  }
}

module.exports = { editProfile };
