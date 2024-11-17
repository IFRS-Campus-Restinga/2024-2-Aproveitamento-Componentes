export const StatusEnum = Object.freeze([
    "Em análise do Ensino",
    "Rejeitado pelo Ensino",
    "Em análise do Coordenador",
    "Rejeitado pelo Coordenador",
    "Em análise do Professor",
    "Rejeitado pelo Professor",
    "Deferido",
    "Indeferido",
    "Cancelado",
]);

export function getEnumIndexByValue(value) {
    return StatusEnum.indexOf(value);
}

export function getFailed() {
    return ["Rejeitado pelo Ensino", "Rejeitado pelo Coordenador", "Rejeitado pelo Professor", "Indeferido", "Cancelado"];
}