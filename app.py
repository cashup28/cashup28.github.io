from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def home():
    return "Merhaba! Python Backend Çalışıyor 🚀"

@app.route('/connect_wallet', methods=['POST'])
def connect_wallet():
    data = request.json
    wallet_address = data.get("wallet_address")

    if not wallet_address:
        return jsonify({"error": "Cüzdan adresi belirtilmedi"}), 400

    return jsonify({"message": "Cüzdan başarıyla bağlandı!", "wallet": wallet_address})

if __name__ == '__main__':
    app.run(debug=True)