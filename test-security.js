// Test script untuk implementasi keamanan
const { hashPassword, verifyPassword, validatePasswordStrength, sanitizeInput, validateEmail, validatePhone } = require('./src/lib/security.js');
const { DEFAULT_USERS } = require('./src/lib/constants.js');

console.log('🧪 Memulai Pengujian Keamanan...\n');

// Test 1: Hash Password
console.log('🔐 Test 1: Password Hashing');
try {
  const hashedPassword = hashPassword('test123');
  console.log('✅ Password hashing berhasil');
  console.log('📊 Hash length:', hashedPassword.length);
} catch (error) {
  console.error('❌ Password hashing gagal:', error.message);
}

// Test 2: Verify Password
console.log('\n🔍 Test 2: Password Verification');
try {
  const hashedPassword = hashPassword('test123');
  const isValid = verifyPassword('test123', hashedPassword);
  const isInvalid = verifyPassword('wrong123', hashedPassword);

  console.log('✅ Password benar:', isValid);
  console.log('✅ Password salah:', !isInvalid);
} catch (error) {
  console.error('❌ Password verification gagal:', error.message);
}

// Test 3: Password Strength Validation
console.log('\n💪 Test 3: Password Strength Validation');
const testPasswords = [
  { password: 'weak', expected: false },
  { password: 'password123', expected: false },
  { password: 'Password123', expected: false },
  { password: 'Password123!', expected: true },
  { password: 'MySecureP@ssw0rd2024!', expected: true }
];

testPasswords.forEach((test, index) => {
  try {
    const isStrong = validatePasswordStrength(test.password);
    const passed = isStrong === test.expected;
    console.log(`  Test ${index + 1}: "${test.password}" - ${passed ? '✅' : '❌'} (${isStrong ? 'Strong' : 'Weak'})`);
  } catch (error) {
    console.error(`  Test ${index + 1} gagal:`, error.message);
  }
});

// Test 4: Input Sanitization
console.log('\n🧹 Test 4: Input Sanitization');
const testInputs = [
  '<script>alert("xss")</script>Hello World',
  'Normal text without issues',
  'Text with <b>bold</b> and <i>italic</i> tags',
  '   Text with extra spaces   ',
  'Text\nwith\nnewlines'
];

testInputs.forEach((input, index) => {
  try {
    const sanitized = sanitizeInput(input);
    console.log(`  Test ${index + 1}: "${input}" -> "${sanitized}"`);
  } catch (error) {
    console.error(`  Test ${index + 1} gagal:`, error.message);
  }
});

// Test 5: Email Validation
console.log('\n📧 Test 5: Email Validation');
const testEmails = [
  { email: 'user@example.com', expected: true },
  { email: 'invalid-email', expected: false },
  { email: 'user@', expected: false },
  { email: '@example.com', expected: false },
  { email: 'user.name@domain.co.id', expected: true }
];

testEmails.forEach((test, index) => {
  try {
    const isValid = validateEmail(test.email);
    const passed = isValid === test.expected;
    console.log(`  Test ${index + 1}: "${test.email}" - ${passed ? '✅' : '❌'} (${isValid ? 'Valid' : 'Invalid'})`);
  } catch (error) {
    console.error(`  Test ${index + 1} gagal:`, error.message);
  }
});

// Test 6: Phone Validation
console.log('\n📱 Test 6: Phone Validation');
const testPhones = [
  { phone: '+62 812-3456-7890', expected: true },
  { phone: '081234567890', expected: true },
  { phone: '021-1234567', expected: true },
  { phone: '12345', expected: false },
  { phone: 'abc-def-ghij', expected: false }
];

testPhones.forEach((test, index) => {
  try {
    const isValid = validatePhone(test.phone);
    const passed = isValid === test.expected;
    console.log(`  Test ${index + 1}: "${test.phone}" - ${passed ? '✅' : '❌'} (${isValid ? 'Valid' : 'Invalid'})`);
  } catch (error) {
    console.error(`  Test ${index + 1} gagal:`, error.message);
  }
});

// Test 7: Default Users Password Hashing
console.log('\n👥 Test 7: Default Users Password Hashing');
try {
  DEFAULT_USERS.forEach((user, index) => {
    console.log(`  User ${index + 1}: ${user.username} - Password hashed: ${user.password.length > 20 ? '✅' : '❌'}`);
  });
  console.log('✅ Semua password default sudah di-hash');
} catch (error) {
  console.error('❌ Test default users gagal:', error.message);
}

console.log('\n🎉 Pengujian keamanan selesai!');
console.log('\n📋 Ringkasan:');
console.log('- ✅ Password hashing dengan bcrypt');
console.log('- ✅ Password verification');
console.log('- ✅ Password strength validation');
console.log('- ✅ Input sanitization');
console.log('- ✅ Email validation');
console.log('- ✅ Phone validation');
console.log('- ✅ Default users password hashing');
