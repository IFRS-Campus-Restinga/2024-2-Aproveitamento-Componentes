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
    "Aprovado pelo Ensino",
]);

export const steps = [
    {index: 0, label: 'Análise do Ensino'},
    {index: 1, label: 'Análise do Coordenador'},
    {index: 2, label: 'Análise do Professor'},
    {index: 3, label: 'Homologação do Coordenador'},
    {index: 4, label: 'Homologação do Ensino'}
]


export const filterStatus = [
    "Sucesso",
    "Pendente",
    "Falha"
]

export function getEnumIndexByValue(value) {
    return StatusEnum.indexOf(value);
}

export function getSucceeded() {
    return ["Analisado pelo Ensino", "Analisado pelo Coordenador", "Analisado pelo Professor",
        "Aprovado pelo Coordenador", "Aprovado pelo Ensino"];
}

export function getFailed() {
    return ["Cancelado pelo Aluno", "Cancelado pelo Ensino", "Cancelado pelo Coordenador",
        "Rejeitado pelo Professor", "Rejeitado pelo Coordenador", "Rejeitado pelo Ensino"];
}

export function getPending() {
    return ["Em análise do Ensino", "Em análise do Coordenador", "Em análise do Professor", "Em homologação do Coordenador",
        "Retornado pelo Coordenador", "Em homologação do Ensino", "Retornado pelo Ensino"]
}

export function getStatusStepIndex(status) {
    if (getStep1Status().includes(status)) return 0;
    if (getStep2Status().includes(status)) return 1;
    if (getStep3Status().includes(status)) return 2;
    if (getStep4Status().includes(status)) return 3;
    if (getStep5Status().includes(status)) return 4;
}

export function getStep1Status() {
    return ["Em análise do Ensino", "Cancelado pelo Aluno", "Cancelado pelo Ensino", "Analisado pelo Ensino"];
}

export function getStep2Status() {
    return ["Em análise do Coordenador", "Cancelado pelo Coordenador", "Analisado pelo Coordenador"]
}

export function getStep3Status() {
    return ["Em análise do Professor", "Rejeitado pelo Professor", "Analisado pelo Professor", "Retornado pelo Coordenador"]
}

export function getStep4Status() {
    return ["Em homologação do Coordenador", "Rejeitado pelo Coordenador", "Aprovado pelo Coordenador", "Retornado pelo Ensino"]
}

export function getStep5Status() {
    return ["Em homologação do Ensino", "Rejeitado pelo Ensino", "Aprovado pelo Ensino"]
}

export function getStatus(status) {
    switch (status) {
        case "Em análise do Ensino":
            return "CRE";
        case "Cancelado pelo Aluno":
            return "CANCELED";
        case "Cancelado pelo Ensino":
            return "C_CRE";
        case "Analisado pelo Ensino":
            return "A_CRE";
        case "Em análise do Coordenador":
            return "COORD";
        case "Cancelado pelo Coordenador":
            return "C_COORD";
        case "Analisado pelo Coordenador":
            return "A_COORD";
        case "Em análise do Professor":
            return "PROF";
        case "Rejeitado pelo Professor":
            return "RJ_PROF";
        case "Analisado pelo Professor":
            return "A_PROF";
        case "Em homologação do Coordenador":
            return "IN_AP_COORD";
        case "Retornado pelo Coordenador":
            return "R_COORD";
        case "Rejeitado pelo Coordenador":
            return "RJ_COORD";
        case "Aprovado pelo Coordenador":
            return "AP_COORD";
        case "Em homologação do Ensino":
            return "IN_AP_CRE";
        case "Retornado pelo Ensino":
            return "R_CRE";
        case "Rejeitado pelo Ensino":
            return "RJ_CRE";
        case "Aprovado pelo Ensino":
            return "AP_CRE";
    }
}
