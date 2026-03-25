window.onload = function () {
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
            await gerarCatalogo(itensPlanilha, "");

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

async function gerarCatalogo(itensPlanilha, logo) {
    let container = "";

    let htmlProdutos = "";
    for (let item of itensPlanilha) {
        const descricao = item.descricao;
        const valor = item.valor;
        const mensagem = encodeURIComponent(`Olá, gostaria de mais informações sobre ${descricao}`);
        const urlWhatsapp = `https://wa.me/5541999999999?text=${mensagem}`;

        htmlProdutos += `
            <div style="border: 1px solid #e0e0e0; border-radius: 8px; padding: 10px; text-align: center; background: white; break-inside: avoid;">
                <img src="imagens/${descricao}.png" style="width: 100%; height: 120px; object-fit: contain;" 
                     onerror="this.src='https://via.placeholder.com/150'">
                <div style="font-weight: 600; font-size: 14px; margin-top: 8px; color: #333;">${descricao}</div>
                <div style="margin-top: 6px; font-size: 16px; font-weight: bold; color: #0d6efd;">R$ ${valor}</div>
                <a href="${urlWhatsapp}" target="_blank" 
                   style="text-decoration: none; background-color: #25D366; color: white; padding: 8px 12px; border-radius: 5px; font-size: 12px; display: inline-block; margin-top: 10px; font-family: sans-serif;">
                    Quero mais informações
                </a>
            </div>
        `;
    }

    container = `
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

                .descricaoProduto {
                    font-size: 12px;
                    color: #666;
                    height: 32px;
                    overflow: hidden;
                }

                .precoProduto {
                    margin-top: 6px;
                    font-size: 16px;
                    font-weight: bold;
                    color: #0d6efd;
                }

                .btnMaisInformacoes {
                    font-size: 12px;
                }
            </style>

        </head>

        <body id="corpoCatalogo">

            <div class="pagina">

                <div class="topoCatalogo d-flex align-items-center justify-content-between">

                    <div class="d-flex align-items-center gap-3">
                        <img class="logo" src="https://via.placeholder.com/80">
                        <div class="tituloCatalogo">Catálogo de Produtos</div>
                    </div>

                    <div>
                        <small>Data: 03/2026</small>
                    </div>

                </div>

                <div id="gridProdutos">

                    ${htmlProdutos}

                </div>

            </div>
        </body>

        </html>
    `;

    const opt = {
        margin: 5,
        filename: 'catalogo.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            scrollY: 0,
            windowWidth: 794
        },
        jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' },
        enableLinks: true
    };

    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        await html2pdf().set(opt).from(container).save();
    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        alert("Erro ao gerar o arquivo. Verifique o console.");
    } finally {
        document.body.removeChild(container);
    }
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