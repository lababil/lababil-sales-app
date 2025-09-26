import { hashPassword } from './src/lib/security.js';

async function updateHashes() {
  const adminHash = await hashPassword('F@ruq2021');
  const kasirHash = await hashPassword('kasir123');

  console.log('Admin hash:', adminHash);
  console.log('Kasir hash:', kasirHash);
}

updateHashes();
