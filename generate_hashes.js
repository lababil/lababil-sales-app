const bcrypt = require('bcryptjs');

async function generateHashes() {
  const adminHash = await bcrypt.hash('F@ruq2021', 10);
  const kasirHash = await bcrypt.hash('kasir123', 10);

  console.log('Admin hash:', adminHash);
  console.log('Kasir hash:', kasirHash);
}

generateHashes();
