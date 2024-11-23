export const StatusEnum = Object.freeze([
    "Em análise do Ensino",
    "Cancelado pelo Aluno",
    "Cancelado pelo Ensino",
    "Analisado pelo Ensino",
    "Em análise do Coordenador",
    "Cancelado pelo Coordenador",
    "Analisado pelo Coordenador",
    "Em análise do Professor",
    "Rejeitado pelo Professor",
    "Analisado pelo Professor",
    "Em homologação do Coordenador",
    "Retornado pelo Coordenador",
    "Rejeitado pelo Coordenador",
    "Aprovado pelo Coordenador",
    "Em homologação do Ensino",
    "Retornado pelo Ensino",
    "Rejeitado pelo Ensino",
    "Aprovado pelo Ensino"
]);

export function getEnumIndexByValue(value) {
    return StatusEnum.indexOf(value);
}

export function getSucceeded() {
    return ["Analisado pelo Ensino", "Analisado pelo Coordenador", "Analisado pelo Professor",
        "Aprovado pelo Coordenador", "Aprovado pelo Ensino"];
}

export function getFailed() {
    return ["Cancelado pelo Aluno", "Cancelado pelo Ensino", "Cancelado pelo Coordenador",
        "Rejeitado pelo Professor", "Rejeitado pelo Coordenador", "Rejeitado pelo Ensino",];
}

export function getPending() {
    return ["Em análise do Ensino", "Em análise do Coordenador", "Em análise do Professor", "Em homologação do Coordenador",
        "Retornado pelo Coordenador", "Em homologação do Ensino", "Retornado pelo Ensino"]
}
