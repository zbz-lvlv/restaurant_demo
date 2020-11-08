from flask import Flask
from flask import render_template
from flask import request
from flask import redirect
from flask import url_for
from flask import session
from flask import jsonify

import os

app = Flask(__name__)

app.config['SECRET_KEY'] = os.urandom(24)
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
app.config.update(SESSION_COOKIE_NAME="restaurant_webpage")

food_items = {
	0: {"name": "日本拉面", "img": "item-0.jpg", "price": 14.90},
	1: {"name": "牛肉汉堡", "img": "item-1.jpg", "price": 19.90},
	2: {"name": "扬州炒饭", "img": "item-2.jpg", "price": 12.90}
}

@app.route("/")
def order_page():
	return render_template("order.html")

@app.route("/get_items", methods=["GET"])
def get_items():
	return food_items

@app.route("/buy_items", methods=["POST"])
def buy_items():
	
	data = request.get_json(force=True)

	total_paid = 0.0

	for item_id in data:
		item_id_numeric = int(item_id)

		print("顾客购买了" + str(data[item_id]) + "份" + food_items[item_id_numeric]["name"])
		total_paid += (food_items[item_id_numeric]["price"] * float(data[item_id]));

	return {"total_paid": total_paid}

if __name__ == "__main__":
	app.run(debug=False, host="0.0.0.0", port=10000)
	session.clear()
