import { useState, useCallback, useRef } from 'react';

interface UseImageUploadProps {
  maxCount?: number;
  onUpload: (base64Images: string[]) => void;
}

export function useImageUpload({ maxCount = 1, onUpload }: UseImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFilesArray = Array.from(files).filter(file => file.type.startsWith('image/')).slice(0, maxCount);
    
    Promise.all(
      newFilesArray.map(file => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      })
    ).then(base64Strings => {
      onUpload(base64Strings);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset input so same file can be selected again
      }
    });
  }, [maxCount, onUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  }, [processFiles]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  }, [processFiles]);

  const triggerUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return {
    isDragging,
    fileInputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    triggerUpload
  };
}
