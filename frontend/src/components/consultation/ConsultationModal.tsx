import React from 'react';
import Modal from '../common/Modal';
import { Input, Select, Textarea, Button } from '../common';
import { useConsultationForm } from '../../hooks/useConsultationForm';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const budgetOptions = [
  { value: '500000', label: '50만원' },
  { value: '1000000', label: '100만원' },
  { value: '2000000', label: '200만원' },
  { value: '3000000', label: '300만원 이상' },
];

const ConsultationModal = ({ isOpen, onClose }: ConsultationModalProps) => {
  const {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    error
  } = useConsultationForm(onClose);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="무료 상담 신청"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="이름"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          error={error && error.includes('이름') ? error : undefined}
        />

        <Input
          label="연락처"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          error={error && error.includes('연락처') ? error : undefined}
        />

        <Input
          label="이메일"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          error={error && error.includes('이메일') ? error : undefined}
        />

        <Select
          label="예상 예산"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          options={budgetOptions}
        />

        <Textarea
          label="상담 내용"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="원하시는 로고 디자인에 대해 설명해주세요."
          required
          error={error && error.includes('상담 내용') ? error : undefined}
        />

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
          >
            상담 신청하기
          </Button>
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={onClose}
          >
            취소
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ConsultationModal; 