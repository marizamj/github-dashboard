let savedCards = JSON.parse(localStorage.getItem('savedCards')) || [];

module.exports = savedCards;
