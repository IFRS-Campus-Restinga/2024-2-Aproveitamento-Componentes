import { toast } from 'react-toastify';

export function handleApiResponse(response) {
    const message = response?.data?.message;
    switch (response?.data?.status) {
        case 'success':
            toast.success(message);
            break;
        case 'alert':
            toast.warn(message);
            break;
        case 'error':
            toast.error(message);
            break;
        default:
            
    }
}