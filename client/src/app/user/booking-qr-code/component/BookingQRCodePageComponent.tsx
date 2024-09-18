"use client"; // Ensure client-side rendering

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import BookingQRCode from '../../../../components/BookingQRCode/BookingQRCode';


const BookingQRCodePageComponent = () => {
    const searchParams = useSearchParams();
    const [booking, setBooking] = useState<any | null>(null); // Initialize booking state
    const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        const bookingParam = searchParams.get('bookingDetails');
        const qrCodeUrlParam = searchParams.get('qrCodeUrl');

        if (bookingParam && qrCodeUrlParam) {
            try {

                // Decode and parse the bookingDetails
                const decodedBookingParam = decodeURIComponent(bookingParam);
                const bookingData = JSON.parse(decodedBookingParam);

                setBooking(bookingData);
                setQrCodeUrl(decodeURIComponent(qrCodeUrlParam));
            } catch (error) {
                setError('Error parsing booking details.');
            }
        } else {
            setError('Missing booking or QR code URL parameter');
        }
    }, [searchParams]);

    if (error) return <div>{error}</div>;
    if (!booking || !qrCodeUrl) return <div>Loading...</div>;

    return (
        <Suspense fallback={<div>...</div>}>
            <BookingQRCode booking={booking} qrCodeUrl={qrCodeUrl} />
        </Suspense>
    );
};

export default BookingQRCodePageComponent;
