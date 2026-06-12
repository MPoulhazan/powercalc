import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Title from './components/Title';
import Navigation from './components/Navigation';
import LanguageSelector from './components/LanguageSelector';
import Amortizer from './components/Amortizer';
import Compounder from './components/Compounder';
import OnboardingTutorial from './components/OnboardingTutorial';
import './App.scss';

function App() {
    const { t } = useTranslation();
    const [activeMenu, setActiveMenu] = useState<string>('amortizer');
    const [showTutorial, setShowTutorial] = useState<boolean>(false);

    useEffect(() => {
        const isFirstVisit = localStorage.getItem('isFirstVisit');
        if (!isFirstVisit) {
            setShowTutorial(true);
            localStorage.setItem('isFirstVisit', 'false');
        }
    }, []);

    const renderActiveComponent = () => {
        switch (activeMenu) {
            case 'amortizer':
                return <Amortizer />;
            case 'compounder':
                return <Compounder />;
            default:
                return <Amortizer />;
        }
    };

    return (
        <div className="app">
            {showTutorial && <OnboardingTutorial onComplete={() => setShowTutorial(false)} />}
            <div className="app__container">
                <div className="app__header">
                    <Title />
                    <LanguageSelector className="app__language-selector" />
                </div>
                <div className="app__content">
                    <p className="app__subtitle">{t('app.subtitle')}</p>
                </div>
                <Navigation activeMenu={activeMenu} onMenuChange={setActiveMenu} />
                <div className="app__calculator">{renderActiveComponent()}</div>
            </div>
        </div>
    );
}

export default App;
