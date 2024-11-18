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

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default {
    CreateKnowledgeCertification,
    CreateRecognitionForm,
    DownloadAttachment
}