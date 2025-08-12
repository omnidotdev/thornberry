"use client";

import {
  FileUploadContext,
  FileUploadDropzone,
  FileUploadHiddenInput,
  FileUploadItem,
  FileUploadItemDeleteTrigger,
  FileUploadItemGroup,
  FileUploadItemName,
  FileUploadItemSizeText,
  FileUploadLabel,
  FileUploadTrigger,
  FileUpload as RegistryFileUpload,
} from "@/registry/thornberry/components/file-upload";

const FileUpload = () => (
  <RegistryFileUpload maxFiles={3} className="mb-8">
    <FileUploadLabel>Upload files</FileUploadLabel>
    <FileUploadDropzone className="gap-4 p-20">
      <p className="text-muted-foreground">Drag and drop files here</p>
      <FileUploadTrigger>Choose files</FileUploadTrigger>
    </FileUploadDropzone>
    <FileUploadItemGroup>
      <FileUploadContext>
        {({ acceptedFiles }) =>
          acceptedFiles.map((file) => (
            <FileUploadItem key={file.name} file={file}>
              <div>
                <FileUploadItemName />
                <FileUploadItemSizeText />
              </div>
              <FileUploadItemDeleteTrigger>×</FileUploadItemDeleteTrigger>
            </FileUploadItem>
          ))
        }
      </FileUploadContext>
    </FileUploadItemGroup>
    <FileUploadHiddenInput />
  </RegistryFileUpload>
);

export default FileUpload;
