from flask import *
import mysql.connector
from db import get_db
from werkzeug.security import generate_password_hash,check_password_hash
#se importa las herramientas de la libreria de flask para renderizar las plantillas
#se importa la funcion de hash de la libreria de werkzeug para ser guardadas en la base de datos

bp = Blueprint('auth',__name__)


#se crea la ruta de login
@bp.route('/login',methods=['POST','GET'])
def login():
    if request.method == 'POST':
        username = request.form['username']    #Se toman los datos colocados por el usuario
        password = request.form['password']
        db,c = get_db()
        c.execute(
            'select * from usuario where username = %s',(username,)  #se busca en la base de datos un usuario que tenga el username indicado
        )
        usuario = c.fetchone() #se carga a una variable
        if usuario: #se valida si la variable contiene datos o no
            if check_password_hash(usuario['password'],password): #se valida que la contraseña indicada por el usuario sea la misma que esta en la base de datos
                session.clear()
                session['user_id'] = usuario['id']
                return redirect(url_for('user.profile'))
        else:
            print('No existe')
    return render_template('auth/login.html')

@bp.route('/register',methods=['POST','GET'])
def register():
    if request.method == 'POST':
        nombre = request.form['nombre']   #Se toman todos los datos ingresados por el usuario
        apellido = request.form['apellido']
        correo = request.form['correo']
        username = request.form['username']
        password = request.form['password']
        edad = request.form['edad']
        db,c = get_db()
        c.execute(
            'select * from usuario where username = %s',(username,) #se busca en la base de datos un usuario  con el mismo nombre indicado por el usuario
        )
        usuario = c.fetchone()
        if not usuario: #se valida si hubo coincidencia o no
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
