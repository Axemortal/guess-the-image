import { Fragment, useEffect, useState, useRef } from "react";
import { createApi } from "unsplash-js";
import { Basic } from "unsplash-js/dist/methods/photos/types";
import "../index.css";
import "./guessTheImage.css";

const unsplashAccessKey: string =
  process.env.REACT_APP_UNSPLASH_ACCESS_KEY || "";

const api = createApi({
  accessKey: unsplashAccessKey,
});

const Photo = ({ photo }: { photo: Basic }) => {
  const { urls, alt_description } = photo;

  return (
    <Fragment>
      <img className="image" src={urls.regular} alt={alt_description || ""} />
    </Fragment>
  );
};

export const GuessTheImage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Basic[]>();
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("cat");

  useEffect(() => {
    api.search
      .getPhotos({ query: searchQuery, orientation: "landscape" })
      .then((res) => {
        if (res.errors) {
          console.log(res.errors);
        }
        console.log(res);
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
        {0 <= photoIndex && photoIndex <= photos.length && (
          <div>
            <Photo photo={photos[photoIndex]} />
          </div>
        )}

        <div>
          <input ref={inputRef} />
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
