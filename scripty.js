window.addEventListener("load",(event)=>{
    const GERARBT = document.getElementById('gerar')//captura botão gerar na página
    GERARBT.addEventListener('click', (event)=>{gerarQR()});//escuta o evento click do botão gerar
})

async function gerarQR(){
    const { jsPDF } = window.jspdf;
    const DOC = new jsPDF();

    const SKU = document.getElementById('sku').value;//captura o valor do input de sku
    const QUANTIDADE = parseInt(document.getElementById('qtd').value, 10);//captura o valor do input de quantidade

    const conteudoTextoConcatenado = [];
    for (let i = 0; i < QUANTIDADE; i++) {
        conteudoTextoConcatenado.push(`${SKU}_xxxxxx_xxxxxx_xxxxxx_xxxxxx_${i + 1}`); // Concatena os valores
    }

    const qrCodePromises = conteudoTextoConcatenado.map((texto, index) =>
        QRCode.toDataURL(texto).then((url) => {
            console.log(`QR Code ${index + 1} gerado com sucesso!`);
            return url;
        })
    );

    const cachedQRListaImagem = await Promise.all(qrCodePromises);

    if (cachedQRListaImagem.length === 0) {
        console.error("Nenhuma imagem encontrada!");
        return;
    }

    cachedQRListaImagem.forEach((qr, index)=>{
        if(index > 0) DOC.addPage();
        DOC.addImage(qr,'PNG', 10, 10, 100, 100);
    })

    if(DOC){
        console.log("Documento pdf encontrado!");
    }

    const pdfBlob = DOC.output('blob');
    const pdfURL = URL.createObjectURL(pdfBlob);
    window.open(pdfURL, '_blank');
}

