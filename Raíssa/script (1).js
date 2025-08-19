document.addEventListener('DOMContentLoaded', function () {
    const botaoDeAcessibilidade = document.getElementById('botao-acessibilidade');
    const opcoesDeAcessibilidade = document.getElementById('opcoes-acessibilidade');

    botaoDeAcessibilidade.addEventListener('click', function () {
        botaoDeAcessibilidade.classList.toggle('rotacao-botao');
        const aberto = opcoesDeAcessibilidade.classList.toggle('apresenta-lista');
        // Atualiza atributos ARIA
        botaoDeAcessibilidade.setAttribute('aria-expanded', (!aberto).toString());
        opcoesDeAcessibilidade.setAttribute('aria-hidden', aberto.toString());
    });

    const aumentaFonteBotao = document.getElementById('aumentar-fonte');
    const diminuiFonteBotao = document.getElementById('diminuir-fonte');

    let tamanhoAtualFonte = 1;

    aumentaFonteBotao.addEventListener('click', function () {
        tamanhoAtualFonte = Math.min(2.0, tamanhoAtualFonte + 0.1);
        document.body.style.fontSize = `${tamanhoAtualFonte}rem`;
        this.setAttribute('aria-pressed', 'true');
        diminuiFonteBotao.setAttribute('aria-pressed', 'false');
    });

    diminuiFonteBotao.addEventListener('click', function () {
        tamanhoAtualFonte = Math.max(0.8, tamanhoAtualFonte - 0.1);
        document.body.style.fontSize = `${tamanhoAtualFonte}rem`;
        this.setAttribute('aria-pressed', 'true');
        aumentaFonteBotao.setAttribute('aria-pressed', 'false');
    });

    // ===== NOVAS 3 ACESSIBILIDADES =====
    // 1) Alto contraste
    const altoContrasteBtn = document.getElementById('alto-contraste');
    altoContrasteBtn.addEventListener('click', function () {
        const ativo = document.body.classList.toggle('alto-contraste');
        this.setAttribute('aria-pressed', ativo.toString());
        // salva preferência na sessão
        sessionStorage.setItem('alto-contraste', ativo ? '1' : '0');
    });
    // restaura preferência
    if (sessionStorage.getItem('alto-contraste') === '1') {
        document.body.classList.add('alto-contraste');
        altoContrasteBtn.setAttribute('aria-pressed', 'true');
    }

    // 2) Espaçar texto (line-height / tracking)
    const espacarBtn = document.getElementById('espacar-texto');
    espacarBtn.addEventListener('click', function () {
        const ativo = document.body.classList.toggle('texto-espacado');
        this.setAttribute('aria-pressed', ativo.toString());
        sessionStorage.setItem('texto-espacado', ativo ? '1' : '0');
    });
    if (sessionStorage.getItem('texto-espacado') === '1') {
        document.body.classList.add('texto-espacado');
        espacarBtn.setAttribute('aria-pressed', 'true');
    }

    // 3) Leitura em voz alta (SpeechSynthesis)
    const lerBtn = document.getElementById('ler-pagina');
    let lendo = false;
    const synth = window.speechSynthesis;

    function textoPrincipal() {
        const sections = document.querySelectorAll('main h1, main h2, main p, main figcaption');
        let texto = '';
        sections.forEach(el => {
            // Evita repetir textos ocultos ou decorativos
            const style = window.getComputedStyle(el);
            if (style.display !== 'none' && style.visibility !== 'hidden') {
                texto += el.textContent.trim() + '. ';
            }
        });
        return texto;
    }

    lerBtn.addEventListener('click', function () {
        if (!synth) return;

        if (!lendo) {
            const utter = new SpeechSynthesisUtterance(textoPrincipal());
            utter.lang = 'pt-BR';
            utter.rate = 1.0;
            utter.pitch = 1.0;
            utter.onend = () => {
                lendo = false;
                lerBtn.setAttribute('aria-pressed', 'false');
                lerBtn.textContent = 'Ler página';
            };
            lendo = true;
            this.setAttribute('aria-pressed', 'true');
            this.textContent = 'Parar leitura';
            synth.cancel(); // garante que nada esteja na fila
            synth.speak(utter);
        } else {
            synth.cancel();
            lendo = false;
            this.setAttribute('aria-pressed', 'false');
            this.textContent = 'Ler página';
        }
    });

    // Acessibilidade: tecla ESC fecha o menu de acessibilidade
    document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape' && !opcoesDeAcessibilidade.classList.contains('apresenta-lista')) {
            botaoDeAcessibilidade.click();
        }
    });
});
