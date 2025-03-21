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
    try {
        const connectedWallet = await connector.restoreConnection();
        if (connectedWallet) {
            status.innerText = `✅ Cüzdan Bağlandı: ${connectedWallet.account.address}`;
            connectBtn.innerText = "🔴 Disconnect Wallet";
            connectBtn.style.backgroundColor = "#ff4444"; // Kırmızı buton
            connectBtn.onclick = async () => {
                await connector.disconnect();
                status.innerText = "⚠️ Cüzdan bağlantısı kesildi!";
                connectBtn.innerText = "🔵 Connect Wallet";
                connectBtn.style.backgroundColor = "#0088cc"; // Mavi buton
                connectBtn.onclick = connectWallet;
            };
        } else {
            status.innerText = "⚠️ Cüzdan bağlı değil!";
            connectBtn.innerText = "🔵 Connect Wallet";
            connectBtn.style.backgroundColor = "#0088cc"; // Mavi buton
            connectBtn.onclick = connectWallet;
        }
    } catch (error) {
        console.error("Cüzdan bağlantı hatası:", error);
        status.innerText = "❌ Cüzdan bağlantı hatası!";
    }
}

// Cüzdanı bağlama fonksiyonu
async function connectWallet() {
    try {
        const wallet = await connector.connectWallet();
        status.innerText = `✅ Cüzdan Bağlandı: ${wallet.account.address}`;
        connectBtn.innerText = "🔴 Disconnect Wallet";
        connectBtn.style.backgroundColor = "#ff4444"; // Kırmızı buton
        connectBtn.onclick = async () => {
            await connector.disconnect();
            status.innerText = "⚠️ Cüzdan bağlantısı kesildi!";
            connectBtn.innerText = "🔵 Connect Wallet";
            connectBtn.style.backgroundColor = "#0088cc"; // Mavi buton
            connectBtn.onclick = connectWallet;
        };
    } catch (error) {
        console.error("Bağlantı hatası:", error);
        status.innerText = "❌ Cüzdan bağlanamadı!";
    }
}

// İlk başlatmada cüzdan durumunu kontrol et
updateWalletStatus();
