const readlineSync = require("readline-sync");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const { requestOtp } = require("./services/getOtp");
const { completeRegister } = require("./services/getRegister");
const { loginAndGetSession, getVouchers } = require("./services/getLogin");
const { editProfile } = require("./services/getProfile");
const { searchStores } = require("./services/getStore");

const saveAccountToFile = (account) => {
  const filePath = path.join(__dirname, "list_account.json");
  let existingAccounts = [];

  if (fs.existsSync(filePath)) {
    try {
      const rawData = fs.readFileSync(filePath);
      existingAccounts = JSON.parse(rawData);
    } catch (err) {
      console.error(
        chalk.red("⚠️ Gagal membaca list_account.json:"),
        err.message
      );
    }
  }

  existingAccounts.push(account);

  try {
    fs.writeFileSync(filePath, JSON.stringify(existingAccounts, null, 2));
    console.log(
      chalk.blue.bold("\n📁 Akun berhasil disimpan ke list_account.json")
    );
  } catch (err) {
    console.error(chalk.red("❌ Gagal menyimpan akun ke file:"), err.message);
  }
};

const doRegister = async () => {
  console.log(chalk.cyan.bold("\n=== Registrasi Akun Nako ==="));

  const name = readlineSync.question(chalk.green("Nama: "));
  const mobile_number = readlineSync.question(
    chalk.green("Nomor HP (+62...): ")
  );
  const password = readlineSync.question(chalk.green("Password: "), {
    hideEchoBack: true,
  });
  const email = readlineSync.questionEMail(chalk.green("Email: "));
  const referral_code = readlineSync.question(
    chalk.green("Referral Code (opsional): ")
  );

  const userData = { name, mobile_number, password, email, referral_code };

  console.log(chalk.yellow("\n📨 Mengirim OTP..."));
  await requestOtp(userData);

  const otp = readlineSync.question(
    chalk.green("\nMasukkan kode OTP yang dikirim ke HP: ")
  );
  console.log(chalk.yellow("\n📦 Mengirim data registrasi..."));
  await completeRegister(userData, otp);

  console.log(chalk.yellow("\n🔐 Login otomatis..."));
  const session = await loginAndGetSession(mobile_number, password);

  if (session) {
    await getVouchers(session);

    console.log(chalk.yellow("\n📇 Memperbarui profil..."));
    await editProfile(userData.name, userData.email, session);

    saveAccountToFile({
      name: userData.name,
      mobile_number: userData.mobile_number,
      email: userData.email,
      session_id: session,
    });
  }
};

const doLogin = async () => {
  console.log(chalk.cyan.bold("\n=== Login Akun Nako ==="));

  const phone = readlineSync.question(chalk.green("Nomor HP (+62...): "));
  const password = readlineSync.question(chalk.green("Password: "), {
    hideEchoBack: true,
  });

  const session = await loginAndGetSession(phone, password);
  if (session) await getVouchers(session);
};

const doAutoRegisterComingSoon = () => {
  console.log(
    chalk.yellow.bold(
      "\n🚧 Fitur Auto Register + Login via SMSHUB masih dalam pengembangan."
    )
  );
  console.log(chalk.gray("Tunggu update selanjutnya ya!\n"));
};

const doStoreSearch = async () => {
  const keyword = readlineSync.question(
    chalk.green("\nMasukkan kata kunci (misal: Semarang): ")
  );
  await searchStores(keyword);
};

const showMenu = () => {
  console.log(
    chalk.bold.cyan(`   
    ___________________________  ._______   _______________
    \\______   \\____    /\\      \\ |   \\   \\ /   /\\_   _____/
     |       _/ /     / /   |   \\|   |\\   Y   /  |    __)_ 
     |    |   \\/     /_/    |    \\   | \\     /   |        \\
     |____|_  /_______ \\____|__  /___|  \\___/   /_______  /
            \\/        \\/       \\/                       \\/
                      KOPI NAKO CREATOR`)
  );
  console.log(chalk.magenta.bold("\n=== Selamat Datang di Nako CLI ==="));
  console.log("[1] Register");
  console.log("[2] Login");
  console.log("[3] Auto Register + Login with SMSHUB (coming soon)");
  console.log("[4] Store Nako");
  console.log("[0] Keluar\n");

  const choice = readlineSync.question(chalk.yellow("Pilih menu: "));

  switch (choice) {
    case "1":
      doRegister().then(showMenu);
      break;
    case "2":
      doLogin().then(showMenu);
      break;
    case "3":
      doAutoRegisterComingSoon();
      showMenu();
      break;
    case "4":
      doStoreSearch().then(showMenu);
      break;
    case "0":
      console.log(chalk.green("👋 Sampai jumpa!"));
      process.exit();
    default:
      console.log(chalk.red("❌ Pilihan tidak valid."));
      showMenu();
  }
};

showMenu();
