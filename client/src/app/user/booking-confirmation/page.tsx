
import React, { Suspense } from "react";
import BookingConfirmationPageComponent from "./component/BookingConfirmationPageComponent";


const BookingConfirmationPage: React.FC = () => {
  

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div >
      <BookingConfirmationPageComponent/>
    </div>
    </Suspense>
  );
};

export default BookingConfirmationPage;
