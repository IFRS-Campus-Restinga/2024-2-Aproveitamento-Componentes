export const StatusEnum = Object.freeze([
    "Cancelado",
    "Solicitação Criada",
    "Rejeitado pelo Ensino",
    "Em análise do Ensino",
    "Rejeitado pelo Coordenador",
    "Em análise do Coordenador",
    "Rejeitado pelo Professor",
    "Em análise do Professor",
    "Indeferido",
    "Deferido",
]);

export function getEnumIndexByValue(value) {
    return StatusEnum.indexOf(value);
}