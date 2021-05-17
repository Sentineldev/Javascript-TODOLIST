from flask import *
from db import get_db

bp = Blueprint('api',__name__)

@bp.route('/get_todos',methods=['GET'])
def get_todos():
    if session.get('user_id'):
        db,c = get_db()
        c.execute(
            'select * from todo where user_id = %s',(session.get('user_id'),)
        )
        todos = c.fetchall()
        return jsonify(todos)
    else:
        print('No se pueden cargar los datos')
        resp = make_response(jsonify({"response":"No se pudieron cargar los datos"}))
        return resp


@bp.route('/create_todo',methods=['POST'])
def create_todo():
    if session.get('user_id'):
        todo = request.get_json()
        user_id = session.get('user_id')
        print(todo)
        db,c = get_db()
        c.execute(
            'insert into todo (titulo,descripcion,user_id,completado) values (%s,%s,%s,%s)',(todo['titulo'],todo['descripcion'],user_id,False)
        )
        db.commit()
        response = make_response(jsonify({"message":"JSON Received"}),200)
        return response
    else:
        response = make_response(jsonify({"message":"Request Failed. Login first!"}),404)
        return response

@bp.route('/delete_todo/<id>',methods=['DELETE'])
def delete_todo(id):
    if session.get('user_id'):
        db,c = get_db()
        c.execute(
            'delete from todo where id = %s and user_id = %s',(id,session.get('user_id'))
        )
        db.commit()
        resp = make_response(jsonify({"message":"Todo deleted!"}))
        return resp
    else:
        resp = make_response(jsonify({"message":"User or todo not found!"}))
        return resp

@bp.route('/update_todo_completado',methods=['PATCH'])
def update_todo_completado():
    if session.get('user_id'):
        todo = request.get_json()
        db,c = get_db()
        c.execute(
            'update todo set completado = %s where id = %s',(todo['completado'],todo['id'])
        )
        db.commit()
        resp = make_response(jsonify({"message":"User updated!"}))
        return resp
    else:
        resp = make_response(jsonify({"message":"User not found!"}))
        return resp

@bp.route('/modificar_todo',methods=['PUT'])
def modificar_todo():
    if session.get('user_id'):
        todo = request.get_json()
        print(todo['titulo'],todo['id'])
        db,c = get_db()
        c.execute(
            'update todo set titulo = %s,descripcion = %s where id = %s',(todo['titulo'],todo['descripcion'],todo['id'])
        )
        db.commit()
        resp = make_response(jsonify({"message":"Updated!"}))
        return resp
    else:
        resp = make_response(jsonify({"message":"Not updated!"}))
        return resp

@bp.route('/listar_busqueda',methods=['GET'])
def listar_busqueda():
    if session.get('user_id'):
        busqueda = request.get_json()
        db,c = get_db()
        c.execute(
            'select * from todo where titulo = %s',(busqueda['titulo'],)
        )
        todos = c.fetchall()
        return jsonify(todos)