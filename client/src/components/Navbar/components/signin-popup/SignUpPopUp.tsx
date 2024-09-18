    // frontend/components/signin-popup/SignUpPopup.tsx
    import React from 'react';
    import styles from './SignUpPopUp.module.css';
    import Image from 'next/image';

    

    const SignUpPopup: React.FC<{ toggleSignUpPopup: () => void }> = ({ toggleSignUpPopup }) => {
        const handleGoogleSignIn = () => {
          window.location.href = 'https://techfriar-week5-movieticket-booking-app.onrender.com/api/auth/google';
        };
        return (
            <div className={styles.signUpPopupOverlay}>
                <div className={styles.signUpPopup}>
                    <button onClick={toggleSignUpPopup} className={styles.closePopup}>
                        &times;
                    </button>
                    <h2>Sign In</h2>
                    <button onClick={handleGoogleSignIn} className={styles.signUpOption}><Image className={styles.authLogo} src="/google-logo.svg" alt="" width={30} height={30}></Image>Continue with Google</button>
                    <button className={styles.signUpOption}>
                    <Image className={styles.authLogo} src="/facebook-logo.svg" alt="" width={30} height={30}></Image> Continue with Facebook
                    </button>
                </div>
            </div>
        );
    };

    export default SignUpPopup;
