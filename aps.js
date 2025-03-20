const tg = window.Telegram.WebApp;
tg.expand();

const connector = new TonConnectSDK.TonConnect({
    manifestUrl: 'https://cashup28.github.io/tonconnect-manifest.json'
});

const connectBtn = document.getElementById('connect-btn');
const status = document.getElementById('status');

connectBtn.onclick = async () => {
    const wallets = await connector.getWallets();
    const wallet = wallets.find(w => w.appName === "tonkeeper") || wallets[0];

    if (wallet) {
        const universalUrl = connector.connect({
            universalLink: wallet.universalLink,
            bridgeUrl: wallet.bridgeUrl
        });

        // Telegram Mini App doğru bağlantı açma metodu:
        tg.openLink(universalUrl);
    } else {
        status.innerText = "Cüzdan bulunamadı!";
    }
};

connector.onStatusChange(wallet => {
    if (wallet) {
        status.innerText = `✅ Bağlanan cüzdan:\n${wallet.account.address}`;
        tg.MainButton.setText('Kapat').show();
        tg.sendData(JSON.stringify({ wallet: wallet.account.address }));
    }
});

tg.MainButton.onClick(() => tg.close());
