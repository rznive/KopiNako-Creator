// getStore.js
const axios = require("axios");
const chalk = require("chalk");

const searchStores = async (keyword) => {
  try {
    const response = await axios.get(
      `https://nako.omni.fm/api/mobile/stores/?merchant=1&token=43cb24BBCaA3b11b3Bcad33C4CbcbcBD`
    );
    const stores = response.data.stores.filter((store) =>
      store.address.toLowerCase().includes(keyword.toLowerCase())
    );

    if (stores.length === 0) {
      console.log(chalk.red(`❌ Tidak ada toko yang ditemukan di ${keyword}`));
      return;
    }
    stores.forEach((store) => {
      console.log(
        chalk.blue.bold(`\nNama Toko: ${store.name}`) +
          chalk.green(`\nAlamat: ${store.address}`) +
          chalk.yellow(`\nNomor Telepon: ${store.phone}`) +
          chalk.green(`\nOrder: ${store.can_accept_order}`) +
          chalk.bold(`\nDelivery: ${store.available_for_delivery}`)

      );
    });
  } catch (err) {
    console.error(chalk.red("❌ Gagal mencari toko: "), err.message);
  }
};

module.exports = { searchStores };
