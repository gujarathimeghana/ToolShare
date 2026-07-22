const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const isStrongPassword = (password) => {
  return typeof password === 'string' && password.length >= 6;
};

module.exports = { isValidEmail, isStrongPassword };
