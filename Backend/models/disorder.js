const mongoose = require('mongoose');

const DisorderSchema = new mongoose.Schema({
  email: String,
  disorder: String,
  date: {
    type: String,
    default: () => {
      const now = new Date();
      now.setHours(now.getHours());
      now.setMinutes(now.getMinutes());
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
  },
  time: {
    type: String,
    default: () => {
      const now = new Date();
      now.setHours(now.getHours());
      now.setMinutes(now.getMinutes());
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    }
  }
});

const Disorder = mongoose.model('Disorder', DisorderSchema);

module.exports = Disorder;
