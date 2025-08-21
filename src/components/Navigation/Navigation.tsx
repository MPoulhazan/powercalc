import React from 'react';
import { useTranslation } from 'react-i18next';
import './Navigation.scss';

interface NavigationProps {
    activeMenu: string;
    onMenuChange: (menu: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({
    activeMenu,
    onMenuChange,
}) => {
    const { t } = useTranslation();
    
    const menuItems = [
        {
            id: 'amortizer',
            label: t('navigation.amortizer.label'),
            description: t('navigation.amortizer.description'),
        },
        {
            id: 'compounder',
            label: t('navigation.compounder.label'),
            description: t('navigation.compounder.description'),
        },
    ];

    return (
        <nav className="navigation">
            <div className="navigation__container">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onMenuChange(item.id)}
                        className={`navigation__item ${
                            activeMenu === item.id
                                ? 'navigation__item--active'
                                : ''
                        }`}
                    >
                        <span className="navigation__label">{item.label}</span>
                        <span className="navigation__description">
                            {item.description}
                        </span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default Navigation;
