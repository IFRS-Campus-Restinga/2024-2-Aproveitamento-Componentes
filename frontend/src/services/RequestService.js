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

export default {
    CreateKnowledgeCertification,
    CreateRecognitionForm,
    DownloadAttachment
}