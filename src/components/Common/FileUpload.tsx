import React, { useState, useRef } from 'react';
import { useUpload } from '@/hooks/useUpload';
import { useGetDocumentCategories } from '@/hooks/useDocumentCategory';
import { createFileFormData, formatFileSize } from '@/utils/cloudinary';
import { IUploadResponse } from '@/interface/response/upload';

interface FileUploadProps {
  onUploadSuccess?: (data: IUploadResponse) => void;
  onUploadError?: (error: Error) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess, onUploadError }) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, loading: isPending } = useUpload();
  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetDocumentCategories();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      // Auto-fill title with filename if empty
      if (!title) {
        setTitle(selectedFile.name.split('.')[0]);
      }
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !title || !category) {
      alert('Vui lòng điền các thông tin bắt buộc: File, Tiêu đề và Danh mục');
      return;
    }
    
    const formData = createFileFormData(file, {
      title,
      description,
      category,
      isShared,
      tags: tags.length > 0 ? tags : undefined
    });
    
    uploadFile(file, {
      title,
      description,
      category,
      isShared,
      tags: tags.length > 0 ? tags : undefined
    })
      .then((data: IUploadResponse) => {
        // Reset form
        setFile(null);
        setTitle('');
        setDescription('');
        setCategory('');
        setIsShared(false);
        setTags([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Callback
        if (onUploadSuccess) {
          onUploadSuccess(data);
        }
      })
      .catch((error: Error) => {
        if (onUploadError) {
          onUploadError(error);
        }
      });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label
          htmlFor="fileInput"
          className="cursor-pointer block mx-auto py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Chọn file
        </label>
        
        {file && (
          <div className="mt-4 text-left bg-gray-100 p-3 rounded">
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-gray-600">{formatFileSize(file.size)}</p>
          </div>
        )}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Tiêu đề <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Mô tả
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          Danh mục <span className="text-red-500">*</span>
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Chọn danh mục</option>
          {!isCategoriesLoading && categoriesData?.data.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Tags</label>
        <div className="flex">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="w-full p-2 border rounded-l"
            placeholder="Nhập tag và nhấn Thêm"
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="bg-gray-200 px-4 rounded-r hover:bg-gray-300"
          >
            Thêm
          </button>
        </div>
        
        {tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {tags.map(tag => (
              <span
                key={tag}
                className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-blue-800 hover:text-blue-900"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="isShared"
          checked={isShared}
          onChange={(e) => setIsShared(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="isShared" className="text-sm">
          Công khai cho tất cả người dùng
        </label>
      </div>
      
      <button
        type="submit"
        disabled={isPending}
        className={`w-full py-2 rounded-lg text-white 
          ${isPending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
      >
        {isPending ? 'Đang tải lên...' : 'Tải lên'}
      </button>
    </form>
  );
};

export default FileUpload; 