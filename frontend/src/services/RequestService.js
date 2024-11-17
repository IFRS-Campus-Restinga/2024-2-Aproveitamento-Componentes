import { apiClient } from "@/libs/api";

async function CreateKnowledgeCertification(data) {
    return apiClient.post('/forms/knowledge-certifications/', data)
}

async function CreateRecognitionForm(data) {
    return apiClient.post('/forms/recognition-forms/', data)
}



export default {
    CreateKnowledgeCertification,
    CreateRecognitionForm,
}