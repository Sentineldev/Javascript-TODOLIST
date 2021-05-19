from flask import *
from flask import jsonify

def create_app():
    app = Flask(__name__)
    #Configuracion de la aplicacion
    app.config.from_mapping(
        SECRET_KEY='nosequeponeraquiXD',
        DATABASE_HOST='localhost',
        DATABASE_USER='root',
        DATABASE_PASSWORD='1234',
        DATABASE ='todo_list'
    )
    #inicializar el script para conectarse a la database
    import db
    db.init_app(app)

    #Importar y registrar los blueprint de los demas modulos
    import auth
    import user
    import api
    app.register_blueprint(user.bp)
    app.register_blueprint(auth.bp)
    app.register_blueprint(api.bp)
    #Ruta principal
    @app.route('/')
    def index():
        return redirect(url_for('auth.login'))
    return app

