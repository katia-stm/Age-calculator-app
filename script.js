let inputs = document.querySelectorAll("input");
let enviar = document.querySelector(".enviar");
let dia = document.getElementById("dia");
let mes = document.getElementById("mes");
let ano = document.getElementById("ano");

let entradas = {
    "dia": document.querySelector(".label-dia"),
    "mes": document.querySelector(".label-mes"),
    "ano": document.querySelector(".label-ano")
}

let erros = {
    "dia": document.querySelector(".erro-dia"),
    "mes": document.querySelector(".erro-mes"),
    "ano": document.querySelector(".erro-ano")
}

let validacoes = {
    "dia": validarDia,
    "mes": validarMes,
    "ano": validarAno
}

enviar.addEventListener("click", (event) => {
    event.preventDefault();
    limparMsgErro();

    let ehValido = true;

    inputs.forEach(input => {
        if(input.value === "") {
            mostrarMsgErro(input, "This field is required");
            ehValido= false;
        }
    });

    if(ehValido) {
        inputs.forEach(input => {
            let validarFuncao = validacoes[input.id];
            if(validarFuncao && !validarFuncao(input)) {
              ehValido = false;
            }
        });
    }

    if(ehValido) {
        let nDia = converterParaInteiro(dia);
        let nMes = converterParaInteiro(mes);
        let nAno = converterParaInteiro(ano);
    
        verificarIdade(nDia, nMes, nAno);
    }
})

inputs.forEach(input => input.addEventListener("keydown", (event) => {
    let tecla = event.key;
    if(tecla.length === 1 && !tecla.match(/[0-9]/)) {
        event.preventDefault();
    }
}))

inputs.forEach(input => input.addEventListener("input", () => {
    if(input.value !== "") {
        limparMsgErroInput(input);
    }
}))

function converterParaInteiro(input) {
    return parseInt(input.value, 10);
}

function diasFevereiro(ano) {
    return ano % 4 === 0 && (ano % 100 !== 0 || ano % 400 === 0) ? 29 : 28;  
}

function calcularDiasMes(mes, ano) {
    let numeroDias = 0

    if (mes === 2) {
      numeroDias = diasFevereiro(ano);
    } else if (mes === 4 || mes === 6 || mes === 9 || mes === 11) {
      numeroDias = 30;
    } else {
      numeroDias = 31;
    }
     
    return numeroDias
}

function validarDia(input) {
    let valorDia = converterParaInteiro(input);
    let valorMes = converterParaInteiro(mes);
    let valorAno = converterParaInteiro(ano);

    if(valorDia < 1 || valorDia > calcularDiasMes(valorMes, valorAno)) {
      mostrarMsgErro(input, "Must be a valid day");
        return false;
    } 
    return true;
}

function validarMes(input) {
    let mes = converterParaInteiro(input);

    if(mes < 1 || mes > 12) {
      mostrarMsgErro(input, "Must be a valid month");
        return false;
    } 
    return true;
}

function validarAno(input) {
    let ano = converterParaInteiro(input);
    let anoAtual = new Date().getFullYear();

    if(ano > anoAtual) {
      mostrarMsgErro(input, "Must be in the past");
        return false;
    } else if(input.value.length !== 4) {
      mostrarMsgErro(input, "Must be 4 digits");
        return false;
    } else if(ano < 1900) {
      mostrarMsgErro(input, "Must be after 1900");
        return false;
    }
    return true;
}

function mostrarMsgErro(input, message) {
    let obterId = input.id;
    let casoErro = erros[obterId];

    inputs.forEach(input => {
        input.classList.add("input-erro");
        entradas[input.id].classList.add("label-erro");
    })
    
    casoErro.innerText = message;
    casoErro.style.display = "inline-block";
}

function limparMsgErroInput(input) {
    input.classList.remove("input-erro");
    let label = entradas[input.id];
    label.classList.remove("label-erro ");
    let erro = erros[input.id];
    erro.style.display = "none";
}

function limparMsgErro() {

    for(let entrada of inputs) {
        entrada.classList.remove("error-input");
    }

    for(let labels of Object.values(entradas)) {
        labels.classList.remove("error-label");
    }

    for(let casoErro of Object.values(erros)) {
      casoErro.innerText = "";
      casoErro.style.display = "none";
    }
}

function exibindoIdade(exibir, valorFinal) {
    let valorAtual = 0; 
    let i = 1 
    let intervalo = setInterval(() => {
      valorAtual += i;
        
        if (valorAtual >= valorFinal) {
          valorAtual = valorFinal;
            clearInterval(intervalo);
        }
        
        exibir.innerText = valorAtual;
    }); 
}

function atualizarElemento(selector, value, singular, plural) {
    let elemento = document.querySelector(selector);
    let armazenaElemento = document.querySelector(`${selector}-result`);

    exibindoIdade(elemento, value);
    armazenaElemento.innerText = value === 1 ? `${singular}` : `${plural}`
}

function verificarIdade(nDia, nMes, nAno) {
    let dataAtual = new Date();
    let anoAtual = dataAtual.getFullYear();
    let mesAtual = dataAtual.getMonth() + 1;
    let diaAtual = dataAtual.getDate();
    let anos = anoAtual - nAno;

    if(mesAtual < nMes || (mesAtual === nMes && diaAtual < nDia)) {
        anos--;
    }
 
    let meses = mesAtual - nMes;

    if(diaAtual < nDia) {
        meses--;
    }

    if(meses < 0) {
        meses+= 12;
    }

    let dias = diaAtual - nDia;
    
    if(dias < 0) {
        let diasMesAnterior = calcularDiasMes(mesAtual - 1 === 0 ? 12 : mesAtual - 1, anoAtual)
        dias += diasMesAnterior;
    }

    atualizarElemento(".anos", anos, " ano", " anos");
    atualizarElemento(".meses", meses, " mes", " meses");
    atualizarElemento(".dias", dias, " dia", " dias");
}

