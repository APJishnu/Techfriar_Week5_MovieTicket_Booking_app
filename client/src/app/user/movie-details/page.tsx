import React, { Suspense} from "react";
import MovieDetailsPageComponent from "./component/MovieDetailsPageComponent";

const MovieDetailsPage: React.FC = () => {

  return (
    <Suspense fallback={<div>Loading QR Code...</div>}>
    <div>
        <MovieDetailsPageComponent />
    </div>
    </Suspense>
);

};

export default MovieDetailsPage;
