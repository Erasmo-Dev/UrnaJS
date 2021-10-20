'use strict'

let usuario;

const xhr = new XMLHttpRequest();

xhr.onreadystatechange = function () {
    if (xhr.readyState == XMLHttpRequest.DONE) {
        usuario = JSON.parse(xhr.responseText)
    }
}
xhr.open('GET', 'https://randomuser.me/api/?results=5&&?inc=picture,name,location', false);
xhr.send(null);


let candidatos = [];

for (let i = 0; i < 5; i++) {
    let candidato = new Object();
    candidato.nome = usuario.results[i].name.first;
    candidato.sobrenome = usuario.results[i].name.last;
    candidato.foto = usuario.results[i].picture.large;
    candidato.numero = String(usuario.results[i].location.street.number).substr(0, 2);
    candidato.votos = 0;
    candidatos.push(candidato);
}


let digitos = "";
function numero(num) {
    digitos += num;
    if (digitos.length == 2) {
        let candidato = buscar(digitos);
        if (candidato != null) {
            document.getElementById("foto").src = candidato.foto;
            document.getElementById("nome").innerHTML = candidato.nome + " " + candidato.sobrenome;
        } else {
            digitos = "";
        }
    }
    if (digitos.length == 3) {
        corrige();
    }
    document.getElementById("numero").innerHTML = digitos;
}


function buscar(digito) {
    let result = null;
    candidatos.forEach(function (candidato) {
        if (candidato.numero == digito) {
            result = candidato;
        }

    })
    return result;

}

let bControle = false;
let branco = 0;
function votarBranco() {
    digitos = "";
    bControle = true;
    document.getElementById("fim").innerHTML = "BRANCO";
}

function corrige() {
    bControle = false;
    let novoDigito = digitos.slice(0, -1);
    digitos = novoDigito
    document.getElementById("fim").innerHTML = "";
    document.getElementById("numero").innerHTML = digitos;
    document.getElementById("foto").src = "";
    document.getElementById("nome").innerHTML = "";
}

function votar(digito) {
    let candidato = null;
    for (let i = 0; i < 5; i++) {
        if (candidatos[i].numero == digito) {
            candidato = candidatos[i];
            candidato.votos += 1;
            candidatos[i] = candidato;
        }
    }
    buscar(digito);
}

let iniciar = true;
function confirma() {
    let btnList = document.querySelectorAll("button.botao");
    if (iniciar == true && buscar(digitos) != null) {
        btnList.forEach(function (btn) {
            btn.disabled = true;
        })
        votar(digitos);
        document.getElementById("numero").innerHTML = "";
        document.getElementById("foto").src = "";
        document.getElementById("nome").innerHTML = "";
        document.getElementById("fim").innerHTML = "FIM";
        digitos = ""
        iniciar = false;
    } else if (bControle) {
        btnList.forEach(function (btn) {
            btn.disabled = true;
        })
        document.getElementById("fim").innerHTML = "FIM";
        branco += 1;
        bControle = false;
        iniciar = false;
    } else {
        btnList.forEach(function (btn) {
            btn.disabled = false;
        })
        document.getElementById("fim").innerHTML = "";
        iniciar = true;
    }
}

let mostrarResultado = true;
function resultado() {
    if (mostrarResultado) {
        const resultado = document.getElementById("mostrar");
        const div = document.createElement("div");

        const brancoHtml = document.createElement("p");
        brancoHtml.innerText = "Branco: " + branco;


        for (let i = 0; i < 5; i++) {

            const tr = document.createElement("p");

            const nome = document.createElement("p");
            nome.innerText = "Nome: " + candidatos[i].nome;

            const numero = document.createElement("p");
            numero.innerText = "Número: " + candidatos[i].numero;

            const votos = document.createElement("p");
            votos.innerText = "Votos: " + candidatos[i].votos;
            votos.setAttribute("style", "margin-bottom: 100px;");

            tr.appendChild(nome);
            tr.appendChild(numero);
            tr.appendChild(votos);
            div.appendChild(tr);
            if (i == 4) {
                div.appendChild(brancoHtml);
            }
            resultado.appendChild(div);
        }
        mostrarResultado = false;
    } else {
        document.getElementById("mostrar").innerHTML = "";
        mostrarResultado = true;
    }

}


