"use client";
import { jsPDF } from "jspdf";

const exportToPdf = (request) =>{
    const doc = new jsPDF();//criando instancia

    doc.setFontSize(16);
    doc.text("notice details", 10, 10);

    //adicionando valoresdo objeto
    const keys = Object.keys(request);
    let yPosition = 20;// iniciando do eixo y

    keys.forEach((key) => {
        const value = request[key];
        doc.setFontSize(12);
        doc.text(`${key} : ${value}`, 10, yPosition);
        yPosition += 10;//move p proxima linha

    });

    doc.save("request_details.pdf")
}

export default exportToPdf;