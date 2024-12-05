import { apiClient } from "@/libs/api";
import {baseURL} from "@/libs/api";

async function CreateKnowledgeCertification(data) {
    return apiClient.post('/forms/knowledge-certifications/', data)
}

async function CreateRecognitionForm(data) {
    return apiClient.post('/forms/recognition-forms/', data)
}

function DownloadAttachment(attachmentId) {
    const url = `${baseURL}/forms/attachments/${attachmentId}/`;
    window.open(url, '_blank');
}

async function GetKnowledgeCertifications() {
    return apiClient.get('/forms/knowledge-certifications/');
}

async function GetRecognitionOfPriorLearning() {
    return apiClient.get('/forms/recognition-forms/');
}

async function GetKnowledgeCertificationsById(id) {
    return apiClient.get(`/forms/knowledge-certifications/?student=${id}`)
}

async function GetRecognitionOfPriorLearningById(id) {
    return apiClient.get(`/forms/recognition-forms/?student=${id}`)
}

export async function checkIfNoticeIsOpen() {
    try {
        const response = await apiClient.get('/forms/check-notice-open/');
        return response.data.isNoticeOpen;
    } catch (error) {
        console.error("Erro ao verificar o edital:", error);
        return false;
    }
}

export default {
    CreateKnowledgeCertification,
    CreateRecognitionForm,
    DownloadAttachment,
    GetRecognitionOfPriorLearning,
    GetKnowledgeCertifications,
    GetKnowledgeCertificationsById,
    GetRecognitionOfPriorLearningById,
    checkIfNoticeIsOpen
}