import { useEffect, useState, useRef } from "react";
import { createApi } from "unsplash-js";
import { Basic } from "unsplash-js/dist/methods/photos/types";
import "../index.css";
import "./guessTheImage.css";
import { ImageCropper } from "./imageCropper";

const api = createApi({
  accessKey: process.env.REACT_APP_UNSPLASH_ACCESS_KEY || "",
});

export const GuessTheImage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Basic[]>();
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("cat");

  useEffect(() => {
    api.search
      .getPhotos({ query: searchQuery, orientation: "portrait", perPage: 20 })
      .then((res) => {
        if (res.errors) {
          console.log(res.errors);
        }
        if (res.response?.results.length) {
          setPhotos(res.response?.results);
        }
      });
  }, [searchQuery]);

  if (!photos) {
    return (
      <main>
        <div>Loading...</div>
      </main>
    );
  }
  if (photos.length === 0) {
    return (
      <main>
        <div>No photos found!</div>
      </main>
    );
  }

  return (
    <main>
      <div className="container">
        {0 <= photoIndex && photoIndex <= photos.length - 1 && (
          <div>
            <ImageCropper photo={photos[photoIndex]} />
          </div>
        )}

        <div>
          <input ref={inputRef} placeholder="Enter a theme" />
          <button
            onClick={() => {
              setSearchQuery(inputRef.current?.value || "");
            }}
          >
            Search
          </button>
        </div>

        <div className="control">
          {/*Left arrow*/}
          {!!photoIndex && (
            <span
              className="button"
              onClick={() => setPhotoIndex(photoIndex - 1)}
            >
              &#8592;
            </span>
          )}

          {/*Right arrow*/}
          {photoIndex !== photos.length - 1 && (
            <span
              className="button"
              onClick={() => setPhotoIndex(photoIndex + 1)}
            >
              &#8594;
            </span>
          )}
        </div>
      </div>
    </main>
  );
};
