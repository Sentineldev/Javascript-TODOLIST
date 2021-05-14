from flask import redirect,Flask,url_for
#se importan las dependecias de flask.
def create_app():
    #Se crea el objeto de flask seguido se configura con los datos de la base de datos.
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
   
    #Se importan los modulos para registrar los blueprint de cada a la aplicacion 
    import auth
    import user
    app.register_blueprint(user.bp)
    app.register_blueprint(auth.bp)
    #se añade la ruta principal que redirecciona automaticamente a la pantalla de login
    @app.route('/')
    def index():
        return redirect(url_for('auth.login'))
    return app
