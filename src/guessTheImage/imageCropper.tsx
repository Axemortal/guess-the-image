import ReactCrop, { type Crop, PixelCrop } from "react-image-crop";
import { useState, useRef } from "react";
import "react-image-crop/dist/ReactCrop.css";
import { Basic } from "unsplash-js/dist/methods/photos/types";

export const ImageCropper = ({ photo }: { photo: Basic }) => {
  const { urls, alt_description } = photo;
  const imgRef = useRef<HTMLImageElement>(null);
  const [isCropped, setIsCropped] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>("");

  const handleCrop = async () => {
    if (typeof crop?.width === "undefined") return;
    if (!completedCrop) return;
    const croppedImage = await getCroppedImg(urls.regular, completedCrop);
    setCroppedImageUrl(croppedImage);
    setIsCropped(true);
  };

  const handleShowFullImage = () => {
    setCrop(undefined);
    setIsCropped(false);
  };

  const getCroppedImg = (src: string, crop: PixelCrop) => {
    return new Promise<string>((resolve) => {
      const img = new Image();
      img.src = src;
      img.crossOrigin = "anonymous";

      img.onload = () => {
        if (imgRef.current === null) return;
        const canvas = document.createElement("canvas");
        const scaleX = img.width / imgRef.current.width;
        const scaleY = img.height / imgRef.current.height;
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
        }, "image/jpeg");
      };
    });
  };

  return (
    <div>
      {!isCropped && (
        <div>
          <ReactCrop
            crop={crop}
            onChange={(_, crop) => {
              setCrop(crop);
            }}
            onComplete={(c) => {
              setCompletedCrop(c);
            }}
          >
            <img ref={imgRef} src={urls.regular} alt={alt_description || ""} />
          </ReactCrop>
        </div>
      )}
      {isCropped && croppedImageUrl && (
        <div>
          <img className="cropped-image" src={croppedImageUrl} alt="Cropped" />
        </div>
      )}
      {isCropped ? (
        <div>
          <button onClick={handleShowFullImage}>Show Full Image</button>
        </div>
      ) : (
        <button onClick={handleCrop}>Crop Image</button>
      )}
    </div>
  );
};
