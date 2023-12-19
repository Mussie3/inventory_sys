import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import React, { useState, Dispatch, SetStateAction } from "react";
import { storage } from "../../firebase.config";
import { type } from "os";

type props = {
  setURL: any;
  path: string;
};
const UploadImageToStorage = ({ setURL, path }: props) => {
  const [imageFile, setImageFile] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);

  const handleSelectedFile = (files: any) => {
    if (files && files[0].size < 10000000) {
      setImageFile(files[0]);

      console.log(files[0]);
    } else {
      console.error("File size to large");
    }
  };

  const handleUploadFile = () => {
    if (imageFile) {
      const name = imageFile.name;
      const storageRef = ref(storage, `${path}${name}`);
      setIsUploading(true);
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgressUpload(progress); // to show progress upload

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          console.error(error.message);
          setIsUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            //url is download url of file
            setURL((pre: any) => {
              return { ...pre, image: url };
            });
          });
          setIsUploading(false);
          setImageFile(undefined);
        }
      );
    } else {
      console.error("File not found");
    }
  };

  const handleRemoveFile = () => setImageFile(undefined);

  return (
    <div className="">
      <div className="col-lg-8 offset-lg-2">
        <input
          type="file"
          name="file-input"
          accept="image/*"
          id="file-input"
          onChange={(files) => handleSelectedFile(files.target.files)}
          className="block w-full text-sm border border-gray-200 rounded-md shadow-sm focus:z-10 focus:border-blue-500 focus:ring-blue-500 file:bg-transparent file:border-0 file:bg-gray-100 file:mr-4 file:py-3 file:px-4 "
        />

        <div className="mt-5">
          {imageFile && (
            <div className="p-4 border rounded-md shadow">
              <div className="flex items-center justify-between">
                <div className="flex gap-4">
                  <span>{imageFile.name}</span>
                  <span>{`Size: ${imageFile.size}`}</span>
                </div>

                <button key="btnRemoveFile" onClick={handleRemoveFile}>
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <div className="flex flex-col items-end gap-4 mt-3">
                <button
                  onClick={handleUploadFile}
                  disabled={isUploading ? true : false}
                  className="h-10 text-white bg-blue-600 rounded w-28"
                >
                  {isUploading ? `Uploading` : `Upload`}
                </button>

                <progress
                  className="w-full rounded progress progress-success"
                  value={progressUpload}
                  max="100"
                ></progress>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadImageToStorage;
