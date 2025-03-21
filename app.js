const tg = window.Telegram.WebApp;
tg.expand();

// TON Connect başlat
const connector = new TonConnectSDK.TonConnect({
    manifestUrl: 'https://cashup28.github.io/tonconnect-manifest.json'
});

const connectBtn = document.getElementById('connect-btn');
const status = document.getElementById('status');

// Cüzdan bağlantı durumu kontrolü
async function updateWalletStatus() {
    const connectedWallet = await connector.restoreConnection();
    if (connectedWallet) {
        status.innerText = `✅ Cüzdan bağlı: ${connectedWallet.account.address}`;
        connectBtn.innerText = "🔴 Disconnect Wallet";
        connectBtn.onclick = async () => {
            await connector.disconnect();
            status.innerText = "🔗 Cüzdan bağlantısı kesildi!";
            connectBtn.innerText = "🔵 Connect Wallet";
            connectBtn.onclick = connectWallet;
        };
    } else {
        connectBtn.innerText = "🔵 Connect Wallet";
        connectBtn.onclick = connectWallet;
    }
}

// Cüzdan bağlantısı
async function connectWallet() {
    try {
        const connectedWallet = await connector.restoreConnection();
        if (connectedWallet) {
            status.innerText = "⚠️ Zaten bir cüzdan bağlı! Önce bağlantıyı kes.";
            return;
        }

        const walletsList = await connector.getWallets();
        
        // Sadece en popüler 6 cüzdanı göster
        const popularWallets = walletsList.filter(wallet =>
            ["Tonkeeper", "Tonhub", "MyTonWallet", "OKX Mini Wallet", "Binance Wallet", "SafePal"].includes(wallet.name)
        );

        if (popularWallets.length === 0) {
            status.innerText = "❌ Hiçbir TON cüzdanı bulunamadı!";
            return;
        }

        status.innerHTML = "<h3>Bir cüzdan seç:</h3>";
        popularWallets.forEach(wallet => {
            const button = document.createElement('button');
            button.textContent = wallet.name;
            button.onclick = async () => {
                try {
                    const connectUrl = await connector.connect({
                        universalLink: wallet.universalLink,
                        bridgeUrl: wallet.bridgeUrl
                    });

                    tg.openLink(connectUrl); // Telegram içinden bağlantıyı aç
                } catch (err) {
                    status.innerText = "❌ Bağlantı hatası: " + err.message;
                }
            };
            status.appendChild(button);
        });

    } catch (error) {
        status.innerText = "⚠️ Bağlantı hatası: " + error.message;
    }
}

// Sayfa açıldığında bağlantı durumunu kontrol et
updateWalletStatus();
connectBtn.onclick = connectWallet;