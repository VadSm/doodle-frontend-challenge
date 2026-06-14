import { toast } from 'react-toastify';

export const showErrorAlert = (message: string) => {
  toast.error(message, {
    toastId: message,
  });
};
