import { useCallback } from 'react';

interface PaystackOptions {
  accessCode: string;
  onSuccess: (response: any) => void;
  onCancel: () => void;
}

export const usePaystackPayment = () => {
  const initializePayment = useCallback(({ accessCode, onSuccess, onCancel }: PaystackOptions) => {
    const handler = (window as any).PaystackPop.setup({
      key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY, // We should ensure this is in .env
      access_code: accessCode,
      callback: (response: any) => {
        onSuccess(response);
      },
      onClose: () => {
        onCancel();
      },
    });
    handler.openIframe();
  }, []);

  return initializePayment;
};
