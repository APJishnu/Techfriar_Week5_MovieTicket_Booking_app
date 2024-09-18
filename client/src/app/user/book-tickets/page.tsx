

import React, {Suspense} from "react";
import BookTicketPageComponent from "./components/BookTicketPageComponent";

const BookTicketsPage = () => {
  return (
    <Suspense fallback={<div>Loading QR Code...</div>}>
    <div>
      <BookTicketPageComponent />
    </div>
    </Suspense>
  );
};

export default BookTicketsPage;
