const tg = window.Telegram.WebApp;
tg.expand();

// TON Connect başlat
const connector = new TonConnectSDK.TonConnect({
    manifestUrl: 'https://cashup28.github.io/tonconnect-manifest.json'
});

const connectBtn = document.getElementById('connect-btn');
const status = document.getElementById('status');

// Cüzdan bağlantı durumunu kontrol et
async function updateWalletStatus() {
    try {
        const connectedWallet = await connector.restoreConnection();
        if (connectedWallet) {
            status.innerText = `✅ Cüzdan bağlı: ${connectedWallet.account.address.slice(0, 6)}...${connectedWallet.account.address.slice(-4)}`;
            connectBtn.innerText = "🔴 Disconnect Wallet";
            connectBtn.style.backgroundColor = "#ff4444";
            connectBtn.onclick = async () => {
                await connector.disconnect();
                status.innerText = "🔗 Cüzdan bağlantısı kesildi!";
                connectBtn.innerText = "🔵 Connect Wallet";
                connectBtn.style.backgroundColor = "#0088cc";
                connectBtn.onclick = connectWallet;
            };
        } else {
            status.innerText = "🔗 Cüzdan bağlı değil!";
            connectBtn.innerText = "🔵 Connect Wallet";
            connectBtn.style.backgroundColor = "#0088cc";
            connectBtn.onclick = connectWallet;
        }
    } catch (error) {
        status.innerText = "⚠️ Cüzdan durumu alınamadı: " + error.message;
        console.error("Cüzdan durumu hatası:", error);
    }
}

// Cüzdan bağlantısı kur
async function connectWallet() {
    try {
        const connectedWallet = await connector.restoreConnection();
        if (connectedWallet) {
            status.innerText = "⚠️ Zaten bir cüzdan bağlı! Önce bağlantıyı kes.";
            return;
        }

        const walletsList = await connector.getWallets();
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
            button.style.margin = "5px";
            button.style.padding = "10px";
            button.style.backgroundColor = "#0088cc";
            button.style.color = "#fff";
            button.style.border = "none";
            button.style.borderRadius = "5px";
            button.onclick = async () => {
                try {
                    const connectUrl = await connector.connect({
                        universalLink: wallet.universalLink,
                        bridgeUrl: wallet.bridgeUrl
                    });
                    tg.openLink(connectUrl);
                } catch (err) {
                    status.innerText = "❌ Bağlantı hatası: " + err.message;
                    console.error("Bağlantı hatası:", err);
                }
            };
            status.appendChild(button);
        });

    } catch (error) {
        status.innerText = "⚠️ Bağlantı hatası: " + error.message;
        console.error("Bağlantı hatası:", error);
    }
}

// Sayfa yüklendiğinde cüzdan durumunu güncelle
updateWalletStatus();
connectBtn.onclick = connectWallet;
