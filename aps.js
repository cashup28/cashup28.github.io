const tg = window.Telegram.WebApp;
tg.expand();

const connector = new TonConnectSDK.TonConnect({
    manifestUrl: 'https://cashup28.github.io/ton-mini-app/tonconnect-manifest.json'
});

const connectBtn = document.getElementById('connect-btn');
const status = document.getElementById('status');
const qrContainer = document.getElementById('qr-code');

connectBtn.onclick = async () => {
    const link = connector.connect({ bridgeUrl: "https://bridge.tonapi.io/bridge" });

    qrContainer.innerHTML = '';
    new QRCode(qrContainer, {
        text: link,
        width: 220,
        height: 220,
    });

    status.innerText = 'QR kodunu TON Wallet uygulaman ile okut!';
};

connector.onStatusChange(wallet => {
    if (wallet) {
        status.innerText = `✅ Cüzdan bağlandı:\n${wallet.account.address}`;
        qrContainer.innerHTML = '';
        tg.MainButton.setText('Kapat').show();
        tg.sendData(JSON.stringify({ wallet: wallet.account.address }));
    }
});

tg.MainButton.onClick(() => tg.close());
