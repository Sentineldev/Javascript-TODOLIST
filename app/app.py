from flask import redirect,Flask,url_for

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
    app.register_blueprint(user.bp)
    app.register_blueprint(auth.bp)

    @app.route('/')
    def index():
        return redirect(url_for('auth.login'))
    return app