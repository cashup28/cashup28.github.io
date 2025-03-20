const tg = window.Telegram.WebApp;
tg.expand();

// TON Connect başlat
const connector = new TonConnectSDK.TonConnect({
    manifestUrl: 'https://cashup28.github.io/tonconnect-manifest.json'
});

const connectBtn = document.getElementById('connect-btn');
const status = document.getElementById('status');

connectBtn.onclick = async () => {
    try {
        const walletsList = await connector.getWallets();
        if (walletsList.length === 0) {
            status.innerText = "❌ Hiçbir TON cüzdanı bulunamadı!";
            return;
        }

        // Kullanıcıya tüm cüzdanları göster
        status.innerHTML = "<h3>Bir cüzdan seç:</h3>";
        walletsList.forEach(wallet => {
            const button = document.createElement('button');
            button.textContent = wallet.name;
            button.onclick = () => {
                const connectUrl = connector.connect({
                    universalLink: wallet.universalLink,
                    bridgeUrl: wallet.bridgeUrl
                });

                tg.openLink(connectUrl);
            };
            status.appendChild(button);
        });

    } catch (error) {
        status.innerText = "⚠️ Bağlantı hatası: " + error.message;
    }
};

// Cüzdan bağlandığında işlem yap
connector.onStatusChange(wallet => {
    if (wallet) {
        status.innerText = `✅ Cüzdan başarıyla bağlandı:\n${wallet.account.address}`;
        tg.MainButton.setText('Kapat').show();
        tg.sendData(JSON.stringify({ wallet: wallet.account.address }));

        // 🔹 Bağlantı tamamlandığında Mini App kapanmasını engelle
        tg.MainButton.onClick(() => {
            status.innerText = "✅ Bağlantı tamamlandı!";
            tg.MainButton.hide(); // Kapatma butonunu gizle
        });
    }
});
