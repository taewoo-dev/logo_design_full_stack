import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Input, Select } from '../../components/common';
import ReactQuill from 'react-quill';
import type { UnprivilegedEditor } from 'react-quill';
import MDEditor from '@uiw/react-md-editor';
import 'react-quill/dist/quill.snow.css';
import { getColumn, createColumn, updateColumn } from '../../api/column';
import type { Column } from '../../types/column';
import { ColumnStatus } from '../../types/column';

type EditorType = 'rich' | 'markdown';

const ColumnEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editorType, setEditorType] = useState<EditorType>('rich');

  const [formData, setFormData] = useState<Partial<Column>>({
    title: '',
    content: '',
    status: ColumnStatus.DRAFT,
    thumbnail_url: null,
    category: '',
  });

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    if (isEditMode) {
      fetchColumn();
    }
  }, [isEditMode]);

  const fetchColumn = async () => {
    try {
      if (!id) return;
      const column = await getColumn(id);
      setFormData(column);
      if (column.thumbnail_url) {
        setPreviewUrl(column.thumbnail_url);
      }
      // 컨텐츠가 마크다운 형식인지 확인
      if (column.content.startsWith('#') || column.content.includes('```')) {
        setEditorType('markdown');
      }
    } catch (error) {
      console.error('컬럼 조회 실패:', error);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setThumbnailFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && id) {
        await updateColumn({
          id,
          title: formData.title!,
          content: formData.content!,
          status: formData.status!,
          thumbnail: thumbnailFile || undefined,
          category: formData.category!,
        });
      } else {
        await createColumn({
          title: formData.title!,
          content: formData.content!,
          status: formData.status!,
          thumbnail: thumbnailFile || undefined,
          category: formData.category!,
        });
      }
      navigate('/admin/columns');
    } catch (error) {
      console.error('저장 실패:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/columns');
  };

  const handleEditorTypeChange = (type: EditorType) => {
    if (type === editorType) return;
    
    if (type === 'markdown') {
      // HTML을 마크다운으로 변환
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formData.content || '';
      const markdown = tempDiv.innerText;
      setFormData({ ...formData, content: markdown });
    } else {
      // 마크다운을 HTML로 변환
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = formData.content || '';
      setFormData({ ...formData, content: tempDiv.innerHTML });
    }
    setEditorType(type);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditMode ? '칼럼 수정' : '새 칼럼 작성'}
              </h1>
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleCancel}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isEditMode ? '수정' : '저장'}
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  label="제목"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="칼럼 제목을 입력하세요"
                />

                <Input
                  label="카테고리"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                  placeholder="칼럼 카테고리를 입력하세요"
                />

                <Select
                  label="상태"
                  value={formData.status}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, status: e.target.value as ColumnStatus })}
                  options={[
                    { value: ColumnStatus.DRAFT, label: '임시저장' },
                    { value: ColumnStatus.PUBLISHED, label: '발행' }
                  ]}
                  required
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    썸네일 이미지
                  </label>
                  <div 
                    className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                    onClick={handleImageClick}
                  >
                    <div className="space-y-1 text-center">
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="mx-auto h-48 w-auto object-contain" />
                      ) : (
                        <>
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <p className="pl-1">이미지를 업로드하려면 클릭하세요</p>
                          </div>
                          <p className="text-xs text-gray-500">권장 크기: 1200x630px</p>
                        </>
                      )}
                    </div>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  내용
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEditorTypeChange('rich')}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      editorType === 'rich'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    리치 텍스트
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEditorTypeChange('markdown')}
                    className={`px-3 py-1 rounded text-sm font-medium ${
                      editorType === 'markdown'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    마크다운
                  </button>
                </div>
              </div>
              <div className="bg-white border border-gray-300 rounded-lg overflow-hidden">
                {editorType === 'rich' ? (
                  <ReactQuill
                    value={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                    modules={{
                      toolbar: [
                        [{ 'header': [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        ['link', 'image'],
                        ['clean']
                      ]
                    }}
                    className="h-96"
                    placeholder="칼럼 내용을 입력하세요..."
                  />
                ) : (
                  <div data-color-mode="light" className="h-96">
                    <MDEditor
                      value={formData.content || ''}
                      onChange={(value: string | undefined) => setFormData({ ...formData, content: value || '' })}
                    />
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ColumnEditor; 