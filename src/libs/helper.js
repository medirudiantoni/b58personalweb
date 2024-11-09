const moment = require("moment");

const timeAgo = (date) => {
  return moment(date).add(7, 'hours').fromNow();
};

const excerpt = (content) => {
  const words = content.split(" ");
  if (words.length > 10) {
    return words.slice(0, 10).join(" ");
  }
  return content;
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return date.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
};

const calculateDuration = (start_, end_) => {
  const start_date = new Date(start_);
  const end_date = new Date(end_);
  const durInDays = (end_date - start_date) / (1000 * 60 * 60 * 24);

  if (durInDays > 30) {
      const months = Math.floor(durInDays / 30);
      const days = Math.floor(durInDays % 30);
      return `${months} bulan ${days} hari`;
  } else {
      return `${durInDays} hari`;
  }
};

function eq(a, b){
  return a === b;
};

module.exports = {
    excerpt,
    timeAgo,
    formatDate,
    calculateDuration,
    eq
};
