import React from 'react';

export const FAQ = () => {
    return (
        <>
            <div className='faq-container' style={{ width: '100%', backgroundColor: 'white', border: '1px solid #dbdbdb', display: 'flex', flexDirection: 'column', minHeight: '90vh', marginBottom: '3vh', padding: '20px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>Frequently Asked Questions</h1>

                <div className='faq-section' style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>What is GamerConnect?</h2>
                    <p style={{ fontSize: '16px', color: '#555' }}>
                        GamerConnect is a revolutionary web application designed to bring gamers together. It’s more than just a social networking platform; it’s a digital ecosystem where gamers can connect, communicate, and collaborate with fellow enthusiasts in a seamless and intuitive manner.
                    </p>
                </div>

                <div className='faq-section' style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>How do I create an account?</h2>
                    <p style={{ fontSize: '16px', color: '#555' }}>
                        Creating an account is easy. Simply click on the "Sign Up" button on the homepage and fill out the registration form with your details. Once you submit the form, you’ll receive a confirmation email to activate your account.
                    </p>
                </div>

                <div className='faq-section' style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>How do I connect with other gamers?</h2>
                    <p style={{ fontSize: '16px', color: '#555' }}>
                        You can connect with other gamers by searching for their profiles using the search bar, following them, and sending them a message. You can also join gaming communities and participate in discussions to meet new people.
                    </p>
                </div>

                <div className='faq-section' style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>What features does GamerConnect offer?</h2>
                    <p style={{ fontSize: '16px', color: '#555' }}>
                        GamerConnect offers a range of features including customizable profiles, in-app messaging, notifications, user-generated content sharing, and real-time interaction with other gamers. You can showcase your achievements, discuss strategies, and stay updated on the latest gaming trends and events.
                    </p>
                </div>

                <div className='faq-section' style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Is GamerConnect free to use?</h2>
                    <p style={{ fontSize: '16px', color: '#555' }}>
                        Yes, GamerConnect is free to use. We believe in creating an inclusive community for gamers worldwide. Some premium features might be available in the future, but the core functionality will always remain free.
                    </p>
                </div>

                <div className='faq-section' style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>How can I reset my password?</h2>
                    <p style={{ fontSize: '16px', color: '#555' }}>
                        If you’ve forgotten your password, click on the "Forgot your password" link on the login page. Enter your registered email address, and we’ll send you instructions on how to reset your password.
                    </p>
                </div>

                <div className='faq-section' style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>Who can I contact for support?</h2>
                    <p style={{ fontSize: '16px', color: '#555' }}>
                        If you need any help or support, you can contact our support team by clicking on the "Contact Us" link at the bottom of the page. Our team is available 24/7 to assist you with any issues you may have.
                    </p>
                </div>

                
            </div>
        </>
    );
}
