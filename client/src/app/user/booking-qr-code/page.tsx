import BookingQRCodePageComponent from './component/BookingQRCodePageComponent';
import { Suspense } from 'react';

const BookingQRPage = () => {
    return (
        <Suspense fallback={<div>Loading QR Code...</div>}>
        <div>
            <BookingQRCodePageComponent />
        </div>
        </Suspense>
    );
};

export default BookingQRPage;

