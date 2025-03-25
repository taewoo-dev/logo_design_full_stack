import { useState } from 'react';

interface ConsultationFormData {
  name: string;
  phone: string;
  email: string;
  budget: string;
  description: string;
}

interface UseConsultationFormReturn {
  formData: ConsultationFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useConsultationForm = (onSuccess: () => void): UseConsultationFormReturn => {
  const [formData, setFormData] = useState<ConsultationFormData>({
    name: '',
    phone: '',
    email: '',
    budget: '500000',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('이름을 입력해주세요.');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('연락처를 입력해주세요.');
      return false;
    }
    if (!formData.email.trim()) {
      setError('이메일을 입력해주세요.');
      return false;
    }
    if (!formData.description.trim()) {
      setError('상담 내용을 입력해주세요.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: API 호출 로직 구현
      await new Promise(resolve => setTimeout(resolve, 1000)); // 임시 딜레이
      onSuccess();
    } catch (err) {
      setError('상담 신청 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    error
  };
}; 