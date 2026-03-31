window.onload = function () {
    document.getElementById('excelFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            const itensPlanilha = XLSX.utils.sheet_to_json(worksheet);

            await gerarCatalogo(itensPlanilha);
        };

        reader.readAsArrayBuffer(file);
    });
};

async function gerarCatalogo(itensPlanilha) {

    let htmlProdutos = "";
    const formatador = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    });

    let contadorItem = 0, contadorLinhas = 1;

    for (let item of itensPlanilha) {

        const descricao = item.descricao;
        const valor = formatador.format(item.valor);

        const mensagem = encodeURIComponent(`Olá, gostaria de mais informações sobre ${descricao}`);
        const urlWhatsapp = `https://wa.me/5541988685776?text=${mensagem}`;

        let bool = false;
        if (contadorItem > 2){ //Elimina erros matemáticos na primeira linha
            //Verifica se o item está na posição 9, 10 e 11 da página
            if (contadorItem % 9 === 0) bool = true;
            if ((contadorItem - 1) % 9 === 0) bool = true;
            if ((contadorItem - 2) % 9 === 0) bool = true;
        }

        

        if (bool){
            htmlProdutos += `
                <div class="cardProduto" style="margin-top: 300px;">
                    <img src="imagens/${descricao}.png">
                    <div class="nomeProduto">${descricao}</div>
                    <a href="${urlWhatsapp}" target="_blank" class="btn">Quero mais informações</a>
                    <div class="precoProduto">${valor}</div>
                </div>
            `;

            contadorLinhas++;
        } else {
            htmlProdutos += `
                <div class="cardProduto">
                    <img src="imagens/${descricao}.png">
                    <div class="nomeProduto">${descricao}</div>
                    <a href="${urlWhatsapp}" target="_blank" class="btn">Quero mais informações</a>
                    <div class="precoProduto">${valor}</div>
                </div>
            `;
        }

        contadorItem++;
    }

    const containerHTML = `
        <div class="pagina">

            <div class="topoCatalogo">
                <div class="topoEsquerda">
                    <img class="logo" src="imagens/logo.png">
                    <div class="tituloCatalogo">Catálogo de Produtos</div>
                </div>
                <div>
                    <small>Data: ${dataAtual()}</small>
                </div>
            </div>

            <div id="gridProdutos">
                ${htmlProdutos}
            </div>

        </div>
    `;

    const div = document.createElement('div');
    div.style.visibility = 'hidden';
    div.innerHTML = containerHTML;

    div.style.width = '794px';
    div.style.margin = '0 auto';
    div.style.fontFamily = 'Arial, sans-serif';

    const style = document.createElement('style');
    style.innerHTML = `
        .pagina {
            background: white;
            padding: 20px;
        }

        .topoCatalogo {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e5e5e5;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }

        .topoEsquerda {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .logo {
            width: 80px;
            height: 80px;
            object-fit: contain;
        }

        .tituloCatalogo {
            font-size: 26px;
            font-weight: bold;
        }

        #gridProdutos {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
        }

        .cardProduto {
            width: 240px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 12px;
            text-align: center;
            box-sizing: border-box;
            page-break-inside: avoid;
        }

        .cardProduto img {
            width: 120px;
            height: 120px;
            object-fit: contain;
        }

        .nomeProduto {
            font-size: 14px;
            font-weight: 600;
            margin-top: 8px;
        }

        .precoProduto {
            margin-top: 8px;
            font-size: 16px;
            font-weight: bold;
            color: #0d6efd;
        }

        .btn {
            display: inline-block;
            margin-top: 8px;
            padding: 6px 10px;
            font-size: 12px;
            background-color: #25D366;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
    `;

    document.head.appendChild(style);
    document.body.appendChild(div);

    div.style.visibility = 'visible';

    const opt = {
        margin: 0,
        filename: 'catalogo.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: {
            scale: 2,
            useCORS: true
        },
        jsPDF: {
            unit: 'pt',
            format: 'a4',
            orientation: 'portrait'
        }
    };

    await html2pdf().set(opt).from(div).save();
    
    document.body.removeChild(div);
    document.head.removeChild(style);

    window.location.reload();
}

function dataAtual() {
    const data = new Date();

    let dia = String(data.getDate()).padStart(2, '0');
    let mes = String(data.getMonth() + 1).padStart(2, '0');
    let ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}