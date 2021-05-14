from flask import *
from db import get_db
bp = Blueprint('user',__name__)


@bp.route('/profile')
def profile():
    if session.get('user_id'):
        db,c = get_db()
        c.execute(
            'select nombre,apellido,correo,edad,username from usuario where id = %s',(session.get('user_id'),)
        )
        usuario = c.fetchone()
        return render_template('user/profile.html',usuario=usuario)
    else:
        return redirect(url_for('auth.login'))


@bp.route('/todo-list')
def todos():
    if session.get('user_id'):
        return render_template('user/todo.html')
    else:
        return redirect(url_for('auth.login'))