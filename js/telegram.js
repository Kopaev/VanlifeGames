(function(){
  function api(method, data) {
    if(!window.TELEGRAM_BOT_TOKEN) {
      console.warn('TELEGRAM_BOT_TOKEN not set');
      return Promise.resolve(null);
    }
    const url = `https://api.telegram.org/bot${window.TELEGRAM_BOT_TOKEN}/${method}`;
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json());
  }

  window.tgGame = {
    init() {
      if(window.Telegram && Telegram.WebApp && Telegram.WebApp.initDataUnsafe) {
        window.tgUserId = Telegram.WebApp.initDataUnsafe.user?.id;
        window.tgChatId = Telegram.WebApp.initDataUnsafe.chat?.id;
        window.tgMessageId = Telegram.WebApp.initDataUnsafe.message?.id;
      } else {
        const params = new URLSearchParams(location.search);
        window.tgUserId = params.get('id');
      }
    },
    setScore(score) {
      return api('setGameScore', {
        user_id: window.tgUserId,
        score: score,
        chat_id: window.tgChatId,
        message_id: window.tgMessageId
      });
    },
    getHighScores() {
      return api('getGameHighScores', {
        user_id: window.tgUserId,
        chat_id: window.tgChatId,
        message_id: window.tgMessageId
      });
    }
  };
  window.addEventListener('load', () => window.tgGame.init());
})();

