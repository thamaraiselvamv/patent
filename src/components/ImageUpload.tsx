import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { ImageSearchResult } from '../lib/types';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onImageSearch: (file: File) => Promise<ImageSearchResult[]>;
}

export function ImageUpload({ onImageSearch }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      try {
        setLoading(true);
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Perform search
        await onImageSearch(file);
      } catch (error) {
        toast.error('Error processing image. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  }, [onImageSearch]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxSize: 10485760, // 10MB
    multiple: false
  });

  const dropzoneVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02 },
    drag: { scale: 0.98 }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <motion.div
        {...getRootProps()}
        variants={dropzoneVariants}
        initial="initial"
        animate={isDragActive ? 'drag' : 'initial'}
        whileHover="hover"
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        
        {preview ? (
          <div className="space-y-4">
            <motion.img
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              src={preview}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg shadow-md"
            />
            <p className="text-sm text-gray-500">Drop a new image or click to change</p>
          </div>
        ) : (
          <div className="space-y-4">
            <motion.div
              animate={{ scale: isDragActive ? 1.1 : 1 }}
              className="flex justify-center"
            >
              <ImageIcon className="h-16 w-16 text-blue-500" />
            </motion.div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Drop your image here' : 'Drop your image here or click to upload'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Supports JPG, PNG, and GIF up to 10MB
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Analyzing image...</p>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Searching through patent databases for similar designs...
          </p>
        </motion.div>
      )}
    </div>
  );
}