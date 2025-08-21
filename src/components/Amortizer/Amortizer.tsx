import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import './Amortizer.scss';

// Enregistrer les composants Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);

interface AmortizationRow {
    paymentNumber: number;
    payment: number;
    principal: number;
    interest: number;
    remainingBalance: number;
}

interface AmortizerProps {
    className?: string;
}

const Amortizer: React.FC<AmortizerProps> = ({ className = '' }) => {
    const { t } = useTranslation();
    const [propertyValue, setPropertyValue] = useState<number>(500000);
    const [downPayment, setDownPayment] = useState<number>(100000);
    const [loanAmount, setLoanAmount] = useState<number>(400000);
    const [interestRate, setInterestRate] = useState<number>(4.5);
    const [amortizationPeriod, setAmortizationPeriod] = useState<number>(25);
    const [paymentFrequency, setPaymentFrequency] = useState<
        'monthly' | 'bi-weekly' | 'weekly'
    >('monthly');
    const [amortizationTable, setAmortizationTable] = useState<
        AmortizationRow[]
    >([]);
    const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);
    const [totalPayments, setTotalPayments] = useState<number>(0);
    const [downPaymentPercentage, setDownPaymentPercentage] =
        useState<number>(20);

    // Calculs d'amortissement
    const calculateAmortization = () => {
        const principal = loanAmount;
        const rate = interestRate / 100;

        // Fréquence de paiement
        let paymentsPerYear = 12;
        if (paymentFrequency === 'bi-weekly') paymentsPerYear = 26;
        if (paymentFrequency === 'weekly') paymentsPerYear = 52;

        const periodicRate = rate / paymentsPerYear;
        const totalPayments = amortizationPeriod * paymentsPerYear;

        // Paiement périodique
        const payment =
            (principal *
                (periodicRate * Math.pow(1 + periodicRate, totalPayments))) /
            (Math.pow(1 + periodicRate, totalPayments) - 1);

        setMonthlyPayment(payment);

        // Tableau d'amortissement
        const table: AmortizationRow[] = [];
        let remainingBalance = principal;
        let totalInterestPaid = 0;

        for (let i = 1; i <= Math.min(totalPayments, 60); i++) {
            // Limite à 60 paiements pour l'affichage
            const interestPayment = remainingBalance * periodicRate;
            const principalPayment = payment - interestPayment;
            remainingBalance -= principalPayment;
            totalInterestPaid += interestPayment;

            table.push({
                paymentNumber: i,
                payment: payment,
                principal: principalPayment,
                interest: interestPayment,
                remainingBalance: Math.max(0, remainingBalance),
            });
        }

        setAmortizationTable(table);
        setTotalInterest(totalInterestPaid);
        setTotalPayments(payment * totalPayments);
    };

    // Calcul automatique du montant du prêt et du pourcentage de mise de fonds
    useEffect(() => {
        const newLoanAmount = propertyValue - downPayment;
        setLoanAmount(Math.max(0, newLoanAmount));
        const newPercentage = (downPayment / propertyValue) * 100;
        setDownPaymentPercentage(Math.min(100, Math.max(0, newPercentage)));
    }, [propertyValue, downPayment]);

    useEffect(() => {
        calculateAmortization();
    }, [loanAmount, interestRate, amortizationPeriod, paymentFrequency]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-CA', {
            style: 'currency',
            currency: 'CAD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Préparer les données pour le graphique circulaire
    const chartData = {
        labels: [
            t('amortizer.results.loanAmount'),
            t('amortizer.results.totalInterest'),
            t('amortizer.results.downPayment'),
        ],
        datasets: [
            {
                data: [loanAmount, totalInterest, downPayment],
                backgroundColor: [
                    'rgba(102, 126, 234, 0.8)', // Principal - Bleu
                    'rgba(72, 187, 120, 0.8)', // Intérêts - Vert
                    'rgba(56, 178, 172, 0.8)', // Mise de fonds - Cyan
                ],
                borderColor: ['#667eea', '#48bb78', '#38b2ac'],
                borderWidth: 3,
                hoverBackgroundColor: [
                    'rgba(102, 126, 234, 1)',
                    'rgba(72, 187, 120, 1)',
                    'rgba(56, 178, 172, 1)',
                ],
                hoverBorderColor: '#ffffff',
                hoverBorderWidth: 2,
            },
        ],
    };

    const chartOptions: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#e2e8f0',
                    font: {
                        family: 'Inter',
                        size: 12,
                        weight: 500, // 👈 number au lieu de string
                    },
                    usePointStyle: true,
                    pointStyle: 'circle', // 👈 littéral reconnu
                    padding: 20,
                },
            },
            title: {
                display: true,
                text: t('amortizer.chart.title'),
                color: '#e2e8f0',
                font: {
                    family: 'Inter',
                    size: 16,
                    weight: 600, // 👈 pareil, number
                },
                padding: {
                    top: 10,
                    bottom: 20,
                },
            },
            tooltip: {
                backgroundColor: 'rgba(26, 35, 50, 0.95)',
                titleColor: '#e2e8f0',
                bodyColor: '#a0aec0',
                borderColor: '#667eea',
                borderWidth: 1,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                    label: function (context) {
                        const value = context.parsed;
                        const total = context.dataset.data.reduce(
                            (a: number, b: number) => a + b,
                            0
                        );
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${formatCurrency(
                            value
                        )} (${percentage}%)`;
                    },
                },
            },
        },
        elements: {
            arc: {
                borderWidth: 2,
            },
        },
        cutout: '60%',
    };

    return (
        <div className={`amortizer ${className}`}>
            <div className="amortizer__header">
                <h2 className="amortizer__title">{t('amortizer.title')}</h2>
                <p className="amortizer__subtitle">{t('amortizer.subtitle')}</p>
            </div>

            <div className="amortizer__content">
                {/* Section des inputs */}
                <div className="amortizer__inputs">
                    <h3 className="amortizer__section-title">
                        {t('amortizer.sections.inputs')}
                    </h3>

                    <div className="amortizer__input-group">
                        <label className="amortizer__label">
                            {t('amortizer.inputs.propertyValue.label')}
                            <span className="amortizer__hint">
                                {t('amortizer.inputs.propertyValue.hint')}
                            </span>
                        </label>
                        <input
                            type="number"
                            value={propertyValue}
                            onChange={(e) =>
                                setPropertyValue(Number(e.target.value))
                            }
                            className="amortizer__input"
                            min="100000"
                            max="10000000"
                            step="10000"
                        />
                    </div>

                    <div className="amortizer__input-group">
                        <label className="amortizer__label">
                            {t('amortizer.inputs.downPayment.label')}
                            <span className="amortizer__hint">
                                {t('amortizer.inputs.downPayment.hint')}
                            </span>
                        </label>
                        <input
                            type="number"
                            value={downPayment}
                            onChange={(e) =>
                                setDownPayment(Number(e.target.value))
                            }
                            className="amortizer__input"
                            min="0"
                            max={propertyValue}
                            step="1000"
                        />
                        <div className="amortizer__down-payment-info">
                            <span className="amortizer__down-payment-percentage">
                                {downPaymentPercentage.toFixed(1)}% de la valeur
                            </span>
                            {downPaymentPercentage < 20 && (
                                <span className="amortizer__down-payment-warning">
                                    ⚠️ Assurance prêt hypothécaire requise
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="amortizer__input-group">
                        <label className="amortizer__label">
                            {t('amortizer.inputs.loanAmount.label')}
                            <span className="amortizer__hint">
                                {t('amortizer.inputs.loanAmount.hint')}
                            </span>
                        </label>
                        <input
                            type="number"
                            value={loanAmount}
                            className="amortizer__input amortizer__input--readonly"
                            readOnly
                        />
                    </div>

                    <div className="amortizer__input-group">
                        <label className="amortizer__label">
                            {t('amortizer.inputs.interestRate.label')}
                            <span className="amortizer__hint">
                                {t('amortizer.inputs.interestRate.hint')}
                            </span>
                        </label>
                        <input
                            type="number"
                            value={interestRate}
                            onChange={(e) =>
                                setInterestRate(Number(e.target.value))
                            }
                            className="amortizer__input"
                            min="0.1"
                            max="20"
                            step="0.1"
                        />
                    </div>

                    <div className="amortizer__input-group">
                        <label className="amortizer__label">
                            {t('amortizer.inputs.amortizationPeriod.label')}
                            <span className="amortizer__hint">
                                {t('amortizer.inputs.amortizationPeriod.hint')}
                            </span>
                        </label>
                        <select
                            value={amortizationPeriod}
                            onChange={(e) =>
                                setAmortizationPeriod(Number(e.target.value))
                            }
                            className="amortizer__select"
                        >
                            <option value={15}>15 ans</option>
                            <option value={20}>20 ans</option>
                            <option value={25}>25 ans</option>
                            <option value={30}>30 ans</option>
                            <option value={35}>35 ans</option>
                        </select>
                    </div>

                    <div className="amortizer__input-group">
                        <label className="amortizer__label">
                            {t('amortizer.inputs.paymentFrequency.label')}
                            <span className="amortizer__hint">
                                {t('amortizer.inputs.paymentFrequency.hint')}
                            </span>
                        </label>
                        <select
                            value={paymentFrequency}
                            onChange={(e) =>
                                setPaymentFrequency(
                                    e.target.value as
                                        | 'monthly'
                                        | 'bi-weekly'
                                        | 'weekly'
                                )
                            }
                            className="amortizer__select"
                        >
                            <option value="monthly">
                                {t('amortizer.paymentFrequencies.monthly')}
                            </option>
                            <option value="bi-weekly">
                                {t('amortizer.paymentFrequencies.biWeekly')}
                            </option>
                            <option value="weekly">
                                {t('amortizer.paymentFrequencies.weekly')}
                            </option>
                        </select>
                    </div>
                </div>

                {/* Section des résultats */}
                <div className="amortizer__results">
                    <h3 className="amortizer__section-title">
                        {t('amortizer.sections.results')}
                    </h3>

                    <div className="amortizer__summary">
                        <div className="amortizer__summary-item amortizer__summary-item--primary">
                            <span className="amortizer__summary-label">
                                {t('amortizer.results.payment')}{' '}
                                {paymentFrequency === 'monthly'
                                    ? 'Mensuel'
                                    : paymentFrequency === 'bi-weekly'
                                    ? 'Bi-hebdomadaire'
                                    : 'Hebdomadaire'}
                            </span>
                            <span className="amortizer__summary-value">
                                {formatCurrency(monthlyPayment)}
                            </span>
                        </div>

                        <div className="amortizer__summary-item">
                            <span className="amortizer__summary-label">
                                {t('amortizer.results.downPayment')}
                            </span>
                            <span className="amortizer__summary-value amortizer__summary-value--down-payment">
                                {formatCurrency(downPayment)} (
                                {downPaymentPercentage.toFixed(1)}%)
                            </span>
                        </div>

                        <div className="amortizer__summary-item">
                            <span className="amortizer__summary-label">
                                {t('amortizer.results.loanAmount')}
                            </span>
                            <span className="amortizer__summary-value amortizer__summary-value--loan">
                                {formatCurrency(loanAmount)}
                            </span>
                        </div>

                        <div className="amortizer__summary-item">
                            <span className="amortizer__summary-label">
                                {t('amortizer.results.totalInterest')}
                            </span>
                            <span className="amortizer__summary-value amortizer__summary-value--interest">
                                {formatCurrency(totalInterest)}
                            </span>
                        </div>

                        <div className="amortizer__summary-item">
                            <span className="amortizer__summary-label">
                                {t('amortizer.results.totalPayments')}
                            </span>
                            <span className="amortizer__summary-value amortizer__summary-value--total">
                                {formatCurrency(totalPayments)}
                            </span>
                        </div>

                        <div className="amortizer__summary-item">
                            <span className="amortizer__summary-label">
                                {t('amortizer.results.ratio')}
                            </span>
                            <span className="amortizer__summary-value amortizer__summary-value--ratio">
                                {((totalInterest / loanAmount) * 100).toFixed(
                                    1
                                )}
                                %
                            </span>
                        </div>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="amortizer__info">
                        <h4 className="amortizer__info-title">
                            {t('amortizer.info.title')}
                        </h4>
                        <ul className="amortizer__info-list">
                            <li className="amortizer__info-item">
                                <span className="amortizer__info-icon">⚠️</span>
                                <strong>
                                    {t('amortizer.info.minDownPayment')}
                                </strong>
                            </li>
                            <li className="amortizer__info-item">
                                <span className="amortizer__info-icon">🏦</span>
                                <strong>{t('amortizer.info.insurance')}</strong>
                            </li>
                            <li className="amortizer__info-item">
                                <span className="amortizer__info-icon">📈</span>
                                <strong>
                                    {t('amortizer.info.stressTest')}
                                </strong>
                            </li>
                            <li className="amortizer__info-item">
                                <span className="amortizer__info-icon">💳</span>
                                <strong>{t('amortizer.info.debtRatio')}</strong>
                            </li>
                        </ul>
                    </div>

                    {/* Graphique de répartition */}
                    <div className="amortizer__chart-container">
                        <Doughnut data={chartData} options={chartOptions} />
                    </div>
                </div>

                {/* Tableau d'amortissement */}
                <div className="amortizer__table-section">
                    <h3 className="amortizer__section-title">
                        {t('amortizer.sections.table')}
                    </h3>

                    <div className="amortizer__table-container">
                        <table className="amortizer__table">
                            <thead>
                                <tr>
                                    <th>
                                        {t('amortizer.table.headers.number')}
                                    </th>
                                    <th>
                                        {t('amortizer.table.headers.payment')}
                                    </th>
                                    <th>
                                        {t('amortizer.table.headers.principal')}
                                    </th>
                                    <th>
                                        {t('amortizer.table.headers.interest')}
                                    </th>
                                    <th>
                                        {t('amortizer.table.headers.balance')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {amortizationTable.map((row) => (
                                    <tr
                                        key={row.paymentNumber}
                                        className="amortizer__table-row"
                                    >
                                        <td className="amortizer__table-cell amortizer__table-cell--number">
                                            {row.paymentNumber}
                                        </td>
                                        <td className="amortizer__table-cell amortizer__table-cell--payment">
                                            {formatCurrency(row.payment)}
                                        </td>
                                        <td className="amortizer__table-cell amortizer__table-cell--principal">
                                            {formatCurrency(row.principal)}
                                        </td>
                                        <td className="amortizer__table-cell amortizer__table-cell--interest">
                                            {formatCurrency(row.interest)}
                                        </td>
                                        <td className="amortizer__table-cell amortizer__table-cell--balance">
                                            {formatCurrency(
                                                row.remainingBalance
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="amortizer__table-note">
                        {t('amortizer.table.note')}{' '}
                        {amortizationPeriod *
                            (paymentFrequency === 'monthly'
                                ? 12
                                : paymentFrequency === 'bi-weekly'
                                ? 26
                                : 52)}{' '}
                        paiements.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Amortizer;
