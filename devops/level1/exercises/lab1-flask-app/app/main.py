from flask import Flask, jsonify, request

app = Flask(__name__)

# Root endpoint (GET)
@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Welcome to Flask Lab2 with V2 demo!"})

# POST endpoint
@app.route("/echo", methods=["POST"])
def echo():
    data = request.get_json(force=True)
    return jsonify({"you_sent": data}), 201

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
