from flask import Flask, request, Response
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
import json
import redis

app = Flask(__name__)
CORS(app)
api = Api(app)

red = redis.Redis()

parser = reqparse.RequestParser()
parser.add_argument("name", type=str, required=True,
                    help="name must be provided")
parser.add_argument("old_name", type=str, required=False,
                    help="old_name must be provided")


def parse_cart(cart):
    if not cart:
        return []
    cart = [json.loads(i.decode("utf-8")) for i in cart]
    return cart


class Cart(Resource):
    def get(self):
        cart = parse_cart(red.lrange('cart', 0, -1))
        return cart

    def post(self):
        args = parser.parse_args()
        cart = parse_cart(red.lrange('cart', 0, -1))

        new_id = 1
        if len(cart):
            new_id = cart[-1]['id'] + 1

        name = args['name']
        product = {
            'id': new_id,
            'name': name
        }
        red.rpush('cart', json.dumps(product))
        cart = parse_cart(red.lrange('cart', 0, -1))
        return cart


class Product(Resource):
    def patch(self, id):
        args = parser.parse_args()
        name = args['name']
        
        cart = parse_cart(red.lrange('cart', 0, -1))
        ind = [n for n, product in enumerate(cart) if product['id'] == id]

        if (not len(ind)):
            return {'message': 'product is not in cart'}, 400

        product = cart[ind[0]]
        product['name'] = name

        red.lset('cart', ind[0], json.dumps(product))

        cart = parse_cart(red.lrange('cart', 0, -1))
        return cart

    def delete(self, id):
        cart = parse_cart(red.lrange('cart', 0, -1))

        product = [product for product in cart if product['id'] == id]

        if (not len(product)):
            return {'message': 'product is not in cart'}, 400

        ok = red.lrem('cart', 0, json.dumps(product[0]))
        print(ok)
        cart = parse_cart(red.lrange('cart', 0, -1))
        return cart


api.add_resource(Cart, "/carts")
api.add_resource(Product, "/carts/<int:id>")

if __name__ == "__main__":
    app.run(debug=True)
