import TonConnect from "@tonconnect/sdk";

// TonConnect başlat
const connector = new TonConnect({
    manifestUrl: 'https://cashup28.github.io/tonconnect-manifest.json'
});

// Telegram WebApp API kontrolü
if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    tg.expand(); // Mini App'i tam ekran yap
} else {
    console.error("Telegram WebApp API bulunamadı!");
}

const connectBtn = document.getElementById("connect-btn");
const status = document.getElementById("status");

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
                status.innerText = "⚠️ Cüzdan bağlantısı kesildi!";
                connectBtn.innerText = "🔵 Connect Wallet";
                connectBtn.style.backgroundColor = "#0088cc"; // Mavi buton
                connectBtn.onclick = connectWallet;
            };
        } else {
            status.innerText = "❌ Cüzdan bağlı değil";
            connectBtn.innerText = "🔵 Connect Wallet";
            connectBtn.style.backgroundColor = "#0088cc"; // Mavi buton
            connectBtn.onclick = connectWallet;
        }
    } catch (error) {
        console.error("Cüzdan durumu alınamadı:", error);
    }
}

// Cüzdan bağlantısını başlat
async function connectWallet() {
    try {
        await connector.connect();
        updateWalletStatus();
    } catch (error) {
        console.error("Bağlantı hatası:", error);
    }
}

// Sayfa yüklendiğinde cüzdan durumunu güncelle
updateWalletStatus();