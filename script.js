let palavraSecreta = ''; 
let dica = ''; 
let palavraDisplay = []; 
let tentativas = 0; 
let acertos = 0; 
let letrasUsadas = []; 
const maxTentativas = 6; 

async function buscarPalavra() { 
    try {
        const resposta = await fetch('http://localhost:3000/forca');
        const dados = await resposta.json();

        
        const palavraAleatoria = dados[Math.floor(Math.random() * dados.length)];
        
        palavraSecreta = palavraAleatoria.palavra.toUpperCase(); 
        dica = palavraAleatoria.dica;

        console.log(palavraSecreta); 
        palavraSecreta = normalizarPalavra(palavraSecreta); 
        inicializarJogo();
    } catch (erro) {
        console.error('Erro ao buscar a palavra:', erro);
        document.getElementById('mensagem').innerText = 'Erro ao carregar a palavra. Tente novamente.';
    }
}

function normalizarPalavra(palavra) { 
    return palavra
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[-]/g, "")
        .replace(/Ç/g, "C")
        .replace(/Â/g, "A"); 
}

function inicializarJogo() { 
    document.getElementById('dicaTexto').innerText = dica; 
    palavraDisplay = Array(palavraSecreta.length).fill('_'); 
    atualizarPalavraDisplay(); 
    criarTecladoVirtual(); 
    tentativas = 0; 
    acertos = 0; 
    letrasUsadas = []; 
    atualizarTentativasRestantes(); 
    atualizarLetrasUsadas(); 
}

function atualizarPalavraDisplay() { 
    document.getElementById('palavra').innerText = palavraDisplay.join(' '); 
}

function criarTecladoVirtual() { 
    const teclado = document.getElementById('teclado'); 
    teclado.innerHTML = ''; 
    const alfabeto = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÇ'; 
    alfabeto.split('').forEach(letra => { 
        const tecla = document.createElement('button'); 
        tecla.classList.add('tecla', 'bg-gray-200', 'hover:bg-gray-400', 'text-lg', 'p-3', 'rounded', 'cursor-pointer'); 
        tecla.innerText = letra; 
        tecla.onclick = () => tentarLetra(letra, tecla); 
        teclado.appendChild(tecla); 
    }); 
}

function tentarLetra(letra, tecla) { 
    const letraNormalizada = normalizarPalavra(letra);
    
    // Verifica se a letra já foi usada
    if (!letrasUsadas.includes(letra)) {
        letrasUsadas.push(letra); 
        atualizarLetrasUsadas(); 

        if (palavraSecreta.includes(letraNormalizada)) { 
            for (let i = 0; i < palavraSecreta.length; i++) { 
                if (palavraSecreta[i] === letraNormalizada) { 
                    palavraDisplay[i] = letra; 
                    acertos++; 
                } 
            }
            tecla.style.backgroundColor = 'green'; 
        } else { 
            tentativas++; 
            atualizarTentativasRestantes(); 
            tecla.style.backgroundColor = 'red'; 
        }
        tecla.disabled = true;
    }
    
    verificarFimDeJogo(); 
    atualizarPalavraDisplay(); 
}

function atualizarTentativasRestantes() { 
    const tentativasRestantes = maxTentativas - tentativas; 
    document.getElementById('tentativasRestantes').innerText = tentativasRestantes; 
}

function verificarFimDeJogo() { 
    const mensagem = document.getElementById('mensagem'); 
    if (tentativas >= maxTentativas) { 
        mensagem.innerText = 'Você perdeu! A palavra era: ' + palavraSecreta; 
        bloquearTeclado(); 
    } else if (acertos === palavraSecreta.length) { 
        mensagem.innerText = 'Você ganhou!'; 
        bloquearTeclado(); 
    } 
}

function bloquearTeclado() { 
    const teclas = document.getElementsByClassName('tecla'); 
    for (let tecla of teclas) { 
        tecla.onclick = null; 
    } 
}

function atualizarLetrasUsadas() {
    document.getElementById('letrasUsadas').innerText = letrasUsadas.join(', '); 
}

function reiniciar() { 
    document.getElementById('mensagem').innerText = ''; 
    buscarPalavra(); 
}

function chutarPalavra() { 
    let chute = prompt("Digite sua palavra: "); 
}

buscarPalavra();
