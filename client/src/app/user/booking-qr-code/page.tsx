"use client";

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import BookingQRCode from '../../../components/BookingQRCode/BookingQRCode';

const BookingQRPage = () => {
    const searchParams = useSearchParams();
    const [booking, setBooking] = useState<any>(null);
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

    return <BookingQRCode booking={booking} qrCodeUrl={qrCodeUrl} />;
};

export default BookingQRPage;
