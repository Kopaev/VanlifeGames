(function(){
  function renderHighScores(data) {
    const container = document.getElementById('leaderboard-container');
    container.innerHTML = '';
    if (!data || !data.result || data.result.length === 0) {
      container.textContent = 'Нет данных';
      return;
    }
    const list = document.createElement('ol');
    data.result.forEach(item => {
      const li = document.createElement('li');
      const name = item.user.username || item.user.first_name || 'Игрок';
      li.textContent = `${name}: ${item.score}`;
      list.appendChild(li);
    });
    container.appendChild(list);
  }

  window.showLeaderboard = function(){
    if(!window.tgGame || typeof tgGame.getHighScores !== 'function') return;
    tgGame.getHighScores().then(renderHighScores);
    document.getElementById('leaderboard-container').style.display = 'block';
  };

  window.toggleLeaderboard = function(){
    const container = document.getElementById('leaderboard-container');
    if(container.style.display === 'block') {
      container.style.display = 'none';
    } else {
      window.showLeaderboard();
    }
  };
})();
