window.onload = function() {
    document.getElementById('excelFile').addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            
            // Lê a primeira planilha
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            
            // Converte para JSON
            const itensPlanilha = XLSX.utils.sheet_to_json(worksheet);
            itensPlanilha.forEach(linha => {
                const campos = Object.keys(linha);

                campos.forEach(nomeColuna => {
                    const valor = linha[nomeColuna];

                    alert (nomeColuna + '-' + valor);
                })
            })
        };
        reader.readAsArrayBuffer(file);
    });
}