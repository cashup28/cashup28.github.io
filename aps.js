const tg = window.Telegram.WebApp;
tg.expand();

const connector = new TonConnectSDK.TonConnect({
    manifestUrl: 'https://cashup28.github.io/tonconnect-manifest.json'
});

const connectBtn = document.getElementById('connect-btn');
const status = document.getElementById('status');

connectBtn.onclick = async () => {
    const walletsList = await connector.getWallets();

    const walletButtons = walletsList.map(wallet => {
        const button = document.createElement('button');
        button.textContent = wallet.name;
        button.onclick = () => {
            const connectUrl = connector.connect({
                universalLink: wallet.universalLink,
                bridgeUrl: wallet.bridgeUrl
            });
            tg.openLink(connectUrl);
        };
        return button;
    });

    status.innerHTML = "";
    walletButtons.forEach(btn => status.appendChild(btn));
};

connector.onStatusChange(wallet => {
    if (wallet) {
        status.innerText = `✅ Cüzdan başarıyla bağlandı:\n${wallet.account.address}`;
        tg.MainButton.setText('Kapat').show();
        tg.sendData(JSON.stringify({ wallet: wallet.account.address }));
    }
});

tg.MainButton.onClick(() => tg.close());
