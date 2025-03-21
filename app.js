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
            status.innerText = `✅ Cüzdan bağlı: ${connectedWallet.account.address}`;
            connectBtn.innerText = "🔴 Disconnect Wallet";
            connectBtn.style.backgroundColor = "#ff4444"; // Kırmızı buton
            connectBtn.onclick = async () => {
                await connector.disconnect();
                status.innerText = "🔗 Cüzdan bağlantısı kesildi!";
                connectBtn.innerText = "🔵 Connect Wallet";
                connectBtn.style.backgroundColor = "#0088cc"; // Mavi buton
                connectBtn.onclick = connectWallet;
            };
        } else {
            connectBtn.innerText = "🔵 Connect Wallet";
            connectBtn.style.backgroundColor = "#0088cc"; // Mavi buton
            connectBtn.onclick = connectWallet;
        }
    } catch (error) {
        status.innerText = "⚠️ Cüzdan durumu alınamadı: " + error.message;
    }
}

// Cüzdan bağlantısı için TON Connect modalını aç
async function connectWallet() {
    try {
        const connectedWallet = await connector.restoreConnection();
        if (connectedWallet) {
            status.innerText = "⚠️ Zaten bir cüzdan bağlı! Önce bağlantıyı kes.";
            return;
        }

        // TON Connect'in standart bağlantı penceresini aç
        await connector.connect();

    } catch (error) {
        status.innerText = "⚠️ Bağlantı hatası: " + error.message;
    }
}

// Sayfa açıldığında bağlantı durumunu kontrol et
updateWalletStatus();
connectBtn.onclick = connectWallet;
