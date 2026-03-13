window.onload = function() {
    document.getElementById('excelFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Lê a primeira planilha
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Converte para JSON
            const itensPlanilha = XLSX.utils.sheet_to_json(worksheet);
            await gerarCatalogo(itensPlanilha);

            //Verifica os nomes presentes no cabeçalho do excel
            itensPlanilha.forEach(linha => {
                const campos = Object.keys(linha);

                campos.forEach(nomeColuna => {
                    const valor = linha[nomeColuna];

                    console.log(nomeColuna + '-' + valor);
                })
            })
        };
        reader.readAsArrayBuffer(file);
    });
}

async function gerarCatalogo(itensPlanilha, logo){
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    iframe.onload = async function () {
        iframe.contentDocument.open();
        iframe.contentDocument.write(`
            <!DOCTYPE html>
            <html lang="pt-br">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

                <title>Catálogo de Produtos</title>

                <style>
                    body {
                        width: 21cm;
                        height: 29.7cm;
                        margin: auto;
                        background: #f1f1f1;
                        font-family: Arial, Helvetica, sans-serif;
                    }

                    .pagina {
                        background: white;
                        padding: 20px;
                    }

                    .topoCatalogo {
                        border-bottom: 2px solid #e5e5e5;
                        padding-bottom: 10px;
                        margin-bottom: 20px;
                    }

                    .logo {
                        width: 80px;
                    }

                    .tituloCatalogo {
                        font-size: 28px;
                        font-weight: bold;
                    }

                    #gridProdutos {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 20px;
                    }

                    .cardProduto {
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        padding: 10px;
                        text-align: center;
                    }

                    .cardProduto img {
                        width: 100%;
                        height: 120px;
                        object-fit: contain;
                    }

                    .nomeProduto {
                        font-weight: 600;
                        font-size: 14px;
                        margin-top: 8px;
                    }

                    .precoProduto {
                        margin-top: 6px;
                        font-size: 16px;
                        font-weight: bold;
                        color: #0d6efd;
                    }
                </style>

            </head>

            <body>

                <div class="pagina">

                    <div class="topoCatalogo d-flex align-items-center justify-content-between">

                        <div class="d-flex align-items-center gap-3">
                            <img class="logo" src="https://via.placeholder.com/80" id="logoCabecalho" hidden>
                            <div class="tituloCatalogo">Catálogo de Produtos</div>
                        </div>

                        <div>
                            <small>Data: ${dataAtual()}</small>
                        </div>

                    </div>

                    <div id="gridProdutos">

                    </div>

                </div>

            </body>

            </html>
        `);
        iframe.contentDocument.close();

        //Recebe as variáveis ID do iframe
        const logoCabecalho = iframe.contentDocument.getElementById("logoCabecalho");
        const gridProdutos = iframe.contentDocument.getElementById("gridProdutos");

        if (logo != "") {
            logoCabecalho.src = logo;
            logoCabecalho.hidden = false;
        }

        for (let item of itensPlanilha){
            gridProdutos += `
                <div class="cardProduto">
                    <img src="${item.imagem}">
                    <div class="nomeProduto">${item.descricao}</div>
                    <div class="precoProduto">R$ ${item.valor}</div>
                    <button type="button" class="btn btn-info btnMaisInformacoes mb-1 mt-1" onclick="enviarMensagemWhatsapp(${item.descricao})">Quero mais informações</button>
                </div>
            `
        }

        iframe.contentWindow.print();

        document.body.removeChild(iframe);
    };

    iframe.src = 'about:blank';
}

function dataAtual() {
    let data = new Date;
    let dataAtual = '';

    let dia = data.getDate();
    let mes = (data.getMonth() + 1);
    let ano = data.getFullYear();

    if (dia < 10) {
        dia = "0" + dia;
    }
    if (mes < 10) {
        mes = "0" + mes;
    }

    dataAtual = dia + "/" + mes + "/" + ano;

    return dataAtual;

}

function enviarMensagemWhatsapp(descricao){
    const numero = "5541999999999";

    const mensagem = encodeURIComponent(
        `Olá, gostaria de mais informações sobre ${descricao}`
    );

    const url = `https://wa.me/${numero}?text=${mensagem}`;

    window.open(url, "_blank");
}