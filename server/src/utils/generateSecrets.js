const crypto = require('crypto');

// Generate a secure random string
const generateSecretKey = (length = 64) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate both secrets
const adminSecretKey = generateSecretKey();
const jwtSecretKey = generateSecretKey();

console.log('\x1b[32m%s\x1b[0m', 'Generated Secret Keys:');
console.log('\x1b[36m%s\x1b[0m', '\nADMIN_SECRET_KEY:');
console.log(adminSecretKey);
console.log('\x1b[36m%s\x1b[0m', '\nJWT_SECRET:');
console.log(jwtSecretKey);
console.log('\n\x1b[33m%s\x1b[0m', 'Add these to your .env file!'); 