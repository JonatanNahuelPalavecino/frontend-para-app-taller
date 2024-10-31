import { toast } from 'react-toastify';

export const notifyError = (message) => toast.error(message);
export const notifySuccess = (message) => toast.success(message);
export const notifyInfo = (message) => toast.info(message);