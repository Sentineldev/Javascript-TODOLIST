from flask import *
import mysql.connector
from db import get_db
from werkzeug.security import generate_password_hash,check_password_hash


bp = Blueprint('auth',__name__)


#autenticacion para el ingreso al perfil del usuario
@bp.route('/login',methods=['POST','GET'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        db,c = get_db()
        c.execute(
            'select * from usuario where username = %s',(username,)
        )
        usuario = c.fetchone()
        if usuario:
            if check_password_hash(usuario['password'],password):
                session.clear()
                session['user_id'] = usuario['id']
                return redirect(url_for('user.profile'))
            else:
                flash('Usuario y/o contraseña invalida.')
        else:
            flash('Usuario y/o contraseña invalida.')
    return render_template('auth/login.html')

#plantilla de registro del usuario
@bp.route('/register',methods=['POST','GET'])
def register():
    if request.method == 'POST':
        nombre = request.form['nombre']
        apellido = request.form['apellido']
        correo = request.form['correo']
        username = request.form['username']
        password = request.form['password']
        edad = request.form['edad']
        db,c = get_db()
        c.execute(
            'select * from usuario where username = %s',(username,)
        )
        usuario = c.fetchone()
        if not usuario:
            c.execute(
                'insert into usuario (nombre,apellido,correo,username,password,edad) values (%s,%s,%s,%s,%s,%s)',
                (nombre,apellido,correo,username,generate_password_hash(password),edad)
            )
            db.commit()
            return redirect(url_for('auth.login'))
    return render_template('auth/register.html')



@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('auth.login'))