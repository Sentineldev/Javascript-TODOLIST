from flask import *
from flask import jsonify

def create_app():
    app = Flask(__name__)
    app.config.from_mapping(
        SECRET_KEY='nosequeponeraquiXD',
        DATABASE_HOST='localhost',
        DATABASE_USER='root',
        DATABASE_PASSWORD='1234',
        DATABASE ='todo_list'
    )

    import db
    db.init_app(app)


    import auth
    import user
    import api
    app.register_blueprint(user.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(api.bp)

    @app.route('/')
    def index():
        return redirect(url_for('auth.login'))
    
    @app.route('/api/v1/transactions',methods=['GET'])
    def get_transactions():
        print('Hola soy un api con metodo GET')
        response = {'name':'Jesus'}
        return jsonify(response)

    @app.route('/json-example',methods=['POST'])
    def json_example():
        req = request.get_json()
        print(req)
        res = make_response(jsonify({"message":"JSON Received"}),200)
        return res
    return app

