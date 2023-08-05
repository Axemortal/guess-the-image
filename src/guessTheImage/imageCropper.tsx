import ReactCrop, { type Crop } from "react-image-crop";
import React, { useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { Basic } from "unsplash-js/dist/methods/photos/types";

export const ImageCropper = ({ photo }: { photo: Basic }) => {
  const { urls, alt_description } = photo;
  const [isCropped, setIsCropped] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

  const handleCrop = async () => {
    if (typeof crop?.width !== "undefined") {
      const croppedImage = await getCroppedImg(urls.regular, crop);
      setCroppedImageUrl(croppedImage);
      setIsCropped(true);
    }
  };

  const handleShowFullImage = () => {
    setCrop(undefined);
    setIsCropped(false);
  };

  const getCroppedImg = (src: string, crop: Crop) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous";

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scaleX = img.naturalWidth / img.width;
        const scaleY = img.naturalHeight / img.height;
        canvas.width = crop.width;
        canvas.height = crop.height;
        const ctx = canvas.getContext("2d");

        ctx?.drawImage(
          img,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          crop.width,
          crop.height
        );

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          }
        }, "image/png");
      };
    });
  };

  return (
    <div>
      {!isCropped && (
        <div>
          <ReactCrop crop={crop} onChange={(newCrop) => setCrop(newCrop)}>
            <img src={urls.regular} alt={alt_description || ""} />
          </ReactCrop>
        </div>
      )}
      {isCropped && croppedImageUrl && (
        <div>
          <img className="cropped-image" src={croppedImageUrl} alt="Cropped" />
        </div>
      )}
      {isCropped ? (
        <button onClick={handleShowFullImage}>Show Full Image</button>
      ) : (
        <button onClick={handleCrop}>Crop Image</button>
      )}
    </div>
  );
};

export default ImageCropper;
