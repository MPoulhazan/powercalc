import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Traductions françaises
const frTranslations = {
    // App générale
    app: {
        subtitle: 'Suite de calculateurs financiers modernes et élégants',
        title: 'PowerCalc',
    },

    // Navigation
    navigation: {
        amortizer: {
            label: '🏠 Amortizer',
            description: "Calculateur d'hypothèque",
        },
        compounder: {
            label: '📈 Compounder',
            description: 'Intérêts composés',
        },
    },

    // Amortizer
    amortizer: {
        title: "🏠 Calculateur d'Hypothèque Canadien",
        subtitle:
            'Calculez votre amortissement et planifiez votre achat immobilier au Canada 🇨🇦',
        sections: {
            inputs: '📊 Paramètres du Prêt',
            results: '📋 Résultats du Calcul',
            table: "📊 Tableau d'Amortissement (60 premiers paiements)",
        },
        inputs: {
            propertyValue: {
                label: '🏠 Valeur de la Propriété (CAD)',
                hint: "Prix d'achat de la propriété",
            },
            downPayment: {
                label: '💰 Mise de Fonds (CAD)',
                hint: 'Montant de votre apport personnel',
            },
            loanAmount: {
                label: '🏦 Montant du Prêt (CAD)',
                hint: 'Montant total emprunté (calculé automatiquement)',
            },
            interestRate: {
                label: "📈 Taux d'Intérêt Annuel (%)",
                hint: "Taux d'intérêt annuel fixe",
            },
            amortizationPeriod: {
                label: "⏰ Période d'Amortissement (années)",
                hint: 'Durée totale du prêt',
            },
            paymentFrequency: {
                label: '🗓️ Fréquence de Paiement',
                hint: 'Fréquence des versements',
            },
        },
        paymentFrequencies: {
            monthly: 'Mensuel (12x/an)',
            biWeekly: 'Bi-hebdomadaire (26x/an)',
            weekly: 'Hebdomadaire (52x/an)',
        },
        results: {
            payment: '💸 Paiement',
            downPayment: '🏠 Mise de Fonds',
            loanAmount: '🏦 Montant Emprunté',
            totalInterest: '🏦 Intérêts Totaux',
            totalPayments: '💰 Paiements Totaux',
            ratio: '📊 Ratio Intérêt/Principal',
        },
        info: {
            title: '💡 Informations Importantes',
            minDownPayment:
                'Mise de fonds minimale : 5% pour les propriétés de moins de 500k$, 10% pour 500k$-1M$',
            insurance:
                'Assurance prêt hypothécaire : Obligatoire si mise de fonds < 20%',
            stressTest:
                'Test de stress : Qualifiez à un taux +2% au-dessus du taux contractuel',
            debtRatio: "Ratio d'endettement : Maximum 44% du revenu brut",
        },
        table: {
            headers: {
                number: '#',
                payment: 'Paiement',
                principal: 'Principal',
                interest: 'Intérêt',
                balance: 'Solde Restant',
            },
            note: '💡 Note : Seuls les 60 premiers paiements sont affichés. Le tableau complet comprend',
        },
        chart: {
            title: '📊 Répartition des Coûts Totaux',
        },
    },

    // Compounder
    compounder: {
        title: "📈 Calculateur d'Intérêts Composés",
        subtitle:
            'Découvrez la puissance des intérêts composés pour faire croître votre patrimoine 💰',
        sections: {
            inputs: "⚙️ Paramètres d'Investissement",
            results: '🎯 Résultats de Projection',
            table: '📊 Progression Année par Année',
        },
        inputs: {
            initialAmount: {
                label: '💵 Montant Initial (CAD)',
                hint: 'Capital de départ',
            },
            monthlyContribution: {
                label: '📅 Contribution Mensuelle (CAD)',
                hint: 'Montant ajouté chaque mois',
            },
            interestRate: {
                label: '📊 Taux de Rendement Annuel (%)',
                hint: 'Rendement espéré par année',
            },
            timeHorizon: {
                label: '⏳ Horizon de Temps (années)',
                hint: "Durée de l'investissement",
            },
            compoundingFrequency: {
                label: '🔄 Fréquence de Capitalisation',
                hint: 'Fréquence du calcul des intérêts',
            },
        },
        frequencies: {
            monthly: 'Mensuelle (12x/an)',
            quarterly: 'Trimestrielle (4x/an)',
            annually: 'Annuelle (1x/an)',
        },
        results: {
            finalValue: '💰 Valeur Finale',
            totalContributions: '💵 Total Contributions',
            interestEarned: '📈 Intérêts Gagnés',
            multiplier: '🚀 Multiplicateur',
        },
        info: {
            title: '💡 Informations Clés',
            frequency:
                "Capitalisation {frequency} : Plus fréquente = plus d'intérêts",
            rule72: 'Règle des 72 : Votre argent double en ~{years} ans à {rate}%',
            regularity:
                "Régularité : Les contributions régulières amplifient l'effet",
            time: 'Temps : Commencer tôt fait toute la différence',
        },
        table: {
            headers: {
                year: 'Année',
                startBalance: 'Solde Début',
                interest: 'Intérêts',
                contributions: 'Contributions',
                endBalance: 'Solde Fin',
            },
            note: '💡 Note : Ces projections sont basées sur un rendement constant de {rate}% avec une capitalisation {frequency}. Les rendements réels peuvent varier.',
        },
        chart: {
            title: '📊 Évolution de votre investissement',
        },
    },
};

// Traductions anglaises
const enTranslations = {
    // App générale
    app: {
        subtitle: 'Modern and elegant financial calculator suite',
        title: 'PowerCalc',
    },

    // Navigation
    navigation: {
        amortizer: {
            label: '🏠 Amortizer',
            description: 'Mortgage calculator',
        },
        compounder: {
            label: '📈 Compounder',
            description: 'Compound interest',
        },
    },

    // Amortizer
    amortizer: {
        title: '🏠 Canadian Mortgage Calculator',
        subtitle:
            'Calculate your amortization and plan your real estate purchase in Canada 🇨🇦',
        sections: {
            inputs: '📊 Loan Parameters',
            results: '📋 Calculation Results',
            table: '📊 Amortization Table (First 60 payments)',
        },
        inputs: {
            propertyValue: {
                label: '🏠 Property Value (CAD)',
                hint: 'Property purchase price',
            },
            downPayment: {
                label: '💰 Down Payment (CAD)',
                hint: 'Amount of your personal contribution',
            },
            loanAmount: {
                label: '🏦 Loan Amount (CAD)',
                hint: 'Total amount borrowed (automatically calculated)',
            },
            interestRate: {
                label: '📈 Annual Interest Rate (%)',
                hint: 'Fixed annual interest rate',
            },
            amortizationPeriod: {
                label: '⏰ Amortization Period (years)',
                hint: 'Total loan duration',
            },
            paymentFrequency: {
                label: '🗓️ Payment Frequency',
                hint: 'Payment frequency',
            },
        },
        paymentFrequencies: {
            monthly: 'Monthly (12x/year)',
            biWeekly: 'Bi-weekly (26x/year)',
            weekly: 'Weekly (52x/year)',
        },
        results: {
            payment: '💸 Payment',
            downPayment: '🏠 Down Payment',
            loanAmount: '🏦 Amount Borrowed',
            totalInterest: '🏦 Total Interest',
            totalPayments: '💰 Total Payments',
            ratio: '📊 Interest/Principal Ratio',
        },
        info: {
            title: '💡 Important Information',
            minDownPayment:
                'Minimum down payment: 5% for properties under 500k$, 10% for 500k$-1M$',
            insurance:
                'Mortgage loan insurance: Required if down payment < 20%',
            stressTest:
                'Stress test: Qualify at a rate +2% above the contractual rate',
            debtRatio: 'Debt ratio: Maximum 44% of gross income',
        },
        table: {
            headers: {
                number: '#',
                payment: 'Payment',
                principal: 'Principal',
                interest: 'Interest',
                balance: 'Remaining Balance',
            },
            note: '💡 Note: Only the first 60 payments are displayed. The complete table includes',
        },
        chart: {
            title: '📊 Total Costs Breakdown',
        },
    },

    // Compounder
    compounder: {
        title: '📈 Compound Interest Calculator',
        subtitle:
            'Discover the power of compound interest to grow your wealth 💰',
        sections: {
            inputs: '⚙️ Investment Parameters',
            results: '🎯 Projection Results',
            table: '📊 Year by Year Progression',
        },
        inputs: {
            initialAmount: {
                label: '💵 Initial Amount (CAD)',
                hint: 'Starting capital',
            },
            monthlyContribution: {
                label: '📅 Monthly Contribution (CAD)',
                hint: 'Amount added each month',
            },
            interestRate: {
                label: '📊 Annual Return Rate (%)',
                hint: 'Expected annual return',
            },
            timeHorizon: {
                label: '⏳ Time Horizon (years)',
                hint: 'Investment duration',
            },
            compoundingFrequency: {
                label: '🔄 Compounding Frequency',
                hint: 'Interest calculation frequency',
            },
        },
        frequencies: {
            monthly: 'Monthly (12x/year)',
            quarterly: 'Quarterly (4x/year)',
            annually: 'Annually (1x/year)',
        },
        results: {
            finalValue: '💰 Final Value',
            totalContributions: '💵 Total Contributions',
            interestEarned: '📈 Interest Earned',
            multiplier: '🚀 Multiplier',
        },
        info: {
            title: '💡 Key Information',
            frequency: '{frequency} Compounding: More frequent = more interest',
            rule72: 'Rule of 72: Your money doubles in ~{years} years at {rate}%',
            regularity: 'Regularity: Regular contributions amplify the effect',
            time: 'Time: Starting early makes all the difference',
        },
        table: {
            headers: {
                year: 'Year',
                startBalance: 'Start Balance',
                interest: 'Interest',
                contributions: 'Contributions',
                endBalance: 'End Balance',
            },
            note: '💡 Note: These projections are based on a constant return of {rate}% with {frequency} compounding. Actual returns may vary.',
        },
        chart: {
            title: '📊 Investment Evolution',
        },
    },
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            fr: {
                translation: frTranslations,
            },
            en: {
                translation: enTranslations,
            },
        },
        fallbackLng: 'fr',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
