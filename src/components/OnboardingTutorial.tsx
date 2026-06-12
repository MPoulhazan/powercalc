import React, { useState } from 'react';
import './OnboardingTutorial.scss';

interface OnboardingTutorialProps {
    onComplete: () => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ onComplete }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: 'Welcome to PowerCalc!',
            description: 'This tutorial will guide you through the main features of our app.',
        },
        {
            title: 'Amortizer',
            description: 'Calculate loan payments with inputs such as principal, interest rate, and term.',
        },
        {
            title: 'Compounder',
            description: 'Project investments with compound interest calculations.',
        },
        {
            title: 'Language Selector',
            description: 'Change the app language to suit your preference.',
        },
    ];

    const handleNext = () => {
        if (step < steps.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="onboarding">
            <div className="onboarding__overlay" />
            <div className="onboarding__content">
                <h2>{steps[step].title}</h2>
                <p>{steps[step].description}</p>
                <button onClick={handleNext} className="onboarding__next-button">
                    {step < steps.length - 1 ? 'Next' : 'Finish'}
                </button>
            </div>
        </div>
    );
};

export default OnboardingTutorial;