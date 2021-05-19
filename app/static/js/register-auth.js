const form = document.getElementById('register-form')
const nombre = document.getElementById('nombre')
const apellido  = document.getElementById('apellido')
const correo = document.getElementById('correo')
const message = document.getElementById('message')

//Validar el nombre del correo
//Dicho nombre debe contener solo, letras,numeros puntos, guion o guion bajo
function validate_email_name(email_name){
    let validated_name = false
    for(char of email_name){
        if( char.charCodeAt() > 64 && char.charCodeAt() < 91){
            validated_name = true
        }
        else if(char.charCodeAt() > 96 && char.charCodeAt() < 123){
            validated_name = true
        }
        else if(char.charCodeAt() === 45 || char.charCodeAt() === 46 || char.charCodeAt() === 95){
            validated_name = true
        }
        else if(char.charCodeAt() >= 48 && char.charCodeAt() <= 57){
            validated_name = true
        }
        else{
            return false
        }
    }
    return validated_name
}
//FUncion para validar que el correo sea valido.
function validated_email(email){
    let email_split = email.split('@')
    let validated = false
    if(email_split.length === 2){
        let email_name = email_split[0]
        let email_domain = email_split[1].split('.')
        if(email_domain.length === 2){
            if(validated_string(email_domain[0]) && validated_string(email_domain[1]) && email_domain[1].length >=2  && email_domain[1].length <=3  ){
                if(validate_email_name(email_name)){
                    if(email_name.length >=6 && email_name.length<= 30){
                        validated = true
                    }
                    else{
                        return false
                    }
                }
                else{
                    return false
                }
            }
            else{
                validated = false
            }
        } 
    }
    else{
        validated = false
    }
    return validated
}
//Funcion para validar un string que es utilizada, para el nombre el apellido
//Dicha string debe contener solo letras
function validated_string(name){
    let validated_name = false
    for(char of name){
        if( char.charCodeAt() > 64 && char.charCodeAt() < 91){
            validated_name = true
        }
        else if(char.charCodeAt() > 96 && char.charCodeAt() < 123){
            validated_name = true
        }
        else{
            return false
        }
    }
    return validated_name
}

//Validar que los campos hayan sido rellenados de manera correcta por el usuario
form.onsubmit = (e) =>{
    if(validated_string(nombre.value)){
        if(validated_string(apellido.value)){
            if(validated_email(correo.value)){
                message.style.color = 'Green'
                message.innerText = 'Registrado satisfactoriamente!'
            }
            else{
                e.preventDefault()
                message.style.color = 'red'
                message.innerText = 'Corre invalido!'
            }
        }
        else{
            e.preventDefault()
            message.style.color = 'red'
            message.innerText = 'Apellido invalido!'
        }
    }
    else{
        e.preventDefault()
        message.style.color = 'red'
        message.innerText = 'Nombre invalido!'
    }
}