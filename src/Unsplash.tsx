import ReactDOM from "react-dom";
import { Fragment, useEffect, useState } from "react";
import { createApi } from "unsplash-js";
import { Basic } from "unsplash-js/dist/methods/photos/types";
import { ApiResponse } from "unsplash-js/dist/helpers/response";
import { Photos } from "unsplash-js/dist/methods/search/types/response";

const unsplashAccessKey: string =
  process.env.REACT_APP_UNSPLASH_ACCESS_KEY || "";

const api = createApi({
  // Don't forget to set your access token here!
  // See https://unsplash.com/developers
  accessKey: unsplashAccessKey,
});

const PhotoComp = ({ photo }: { photo: Basic }) => {
  const { user, urls } = photo;

  return (
    <Fragment>
      <img className="img" src={urls.regular} />
    </Fragment>
  );
};

const Body = () => {
  const [data, setPhotosResponse] = useState<ApiResponse<Photos>>();

  useEffect(() => {
    api.search
      .getPhotos({ query: "cat", orientation: "landscape" })
      .then((result) => {
        console.log(result);
        setPhotosResponse(result);
      })
      .catch(() => {
        console.log("something went wrong!");
      });
  }, []);

  if (data === null) {
    return <div>Loading...</div>;
  } else if (data?.errors) {
    return (
      <div>
        <div>{data.errors[0]}</div>
        <div>PS: Make sure to set your access token!</div>
      </div>
    );
  } else {
    return (
      <div className="feed">
        <ul className="columnUl">
          {data?.response.results.map((photo: Basic) => (
            <li key={photo.id}>
              <PhotoComp photo={photo} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
};

export const Home = () => {
  return (
    <main className="root">
      <Body />
    </main>
  );
};
