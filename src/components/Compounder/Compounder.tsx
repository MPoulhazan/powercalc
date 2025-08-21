import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    ChartOptions,
} from 'chart.js';
import './Compounder.scss';

// Enregistrer les composants Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface CompoundingRow {
    year: number;
    startBalance: number;
    interestEarned: number;
    contributions: number;
    endBalance: number;
}

interface CompounderProps {
    className?: string;
}

const Compounder: React.FC<CompounderProps> = ({ className = '' }) => {
    const { t } = useTranslation();
    const [initialAmount, setInitialAmount] = useState<number>(10000);
    const [monthlyContribution, setMonthlyContribution] = useState<number>(500);
    const [interestRate, setInterestRate] = useState<number>(7);
    const [timeHorizon, setTimeHorizon] = useState<number>(20);
    const [compoundingFrequency, setCompoundingFrequency] = useState<
        'monthly' | 'quarterly' | 'annually'
    >('monthly');
    const [compoundingTable, setCompoundingTable] = useState<CompoundingRow[]>(
        []
    );
    const [finalAmount, setFinalAmount] = useState<number>(0);
    const [totalContributions, setTotalContributions] = useState<number>(0);
    const [totalInterest, setTotalInterest] = useState<number>(0);

    // Calculs d'intérêts composés
    const calculateCompounding = () => {
        const rate = interestRate / 100;
        let periodsPerYear = 12;

        if (compoundingFrequency === 'quarterly') periodsPerYear = 4;
        if (compoundingFrequency === 'annually') periodsPerYear = 1;

        const periodicRate = rate / periodsPerYear;
        const periodicContribution =
            monthlyContribution * (12 / periodsPerYear);

        const table: CompoundingRow[] = [];
        let currentBalance = initialAmount;
        let totalContributionsAmount = initialAmount;

        for (let year = 1; year <= timeHorizon; year++) {
            const startBalance = currentBalance;
            let yearlyInterest = 0;
            let yearlyContributions = 0;

            // Calcul pour chaque période dans l'année
            for (let period = 1; period <= periodsPerYear; period++) {
                const periodInterest = currentBalance * periodicRate;
                yearlyInterest += periodInterest;
                currentBalance += periodInterest;

                // Ajouter la contribution à la fin de la période
                currentBalance += periodicContribution;
                yearlyContributions += periodicContribution;
                totalContributionsAmount += periodicContribution;
            }

            table.push({
                year,
                startBalance,
                interestEarned: yearlyInterest,
                contributions: yearlyContributions,
                endBalance: currentBalance,
            });
        }

        setCompoundingTable(table);
        setFinalAmount(currentBalance);
        setTotalContributions(totalContributionsAmount);
        setTotalInterest(currentBalance - totalContributionsAmount);
    };

    useEffect(() => {
        calculateCompounding();
    }, [
        initialAmount,
        monthlyContribution,
        interestRate,
        timeHorizon,
        compoundingFrequency,
    ]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-CA', {
            style: 'currency',
            currency: 'CAD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getFrequencyLabel = () => {
        switch (compoundingFrequency) {
            case 'monthly':
                return 'Mensuelle';
            case 'quarterly':
                return 'Trimestrielle';
            case 'annually':
                return 'Annuelle';
            default:
                return 'Mensuelle';
        }
    };

    // Préparer les données pour le graphique
    const chartData = {
        labels: compoundingTable.map((row) => `Année ${row.year}`),
        datasets: [
            {
                label: t('compounder.results.finalValue'),
                data: compoundingTable.map((row) => row.endBalance),
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: t('compounder.results.totalContributions'),
                data: compoundingTable.map(
                    (row) =>
                        row.startBalance + row.year * monthlyContribution * 12
                ),
                borderColor: '#38b2ac',
                backgroundColor: 'rgba(56, 178, 172, 0.1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#38b2ac',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
                borderDash: [5, 5],
            },
            {
                label: t('compounder.results.interestEarned'),
                data: compoundingTable.map(
                    (row) =>
                        row.endBalance -
                        (row.startBalance + row.year * monthlyContribution * 12)
                ),
                borderColor: '#48bb78',
                backgroundColor: 'rgba(72, 187, 120, 0.1)',
                borderWidth: 2,
                fill: false,
                tension: 0.4,
                pointBackgroundColor: '#48bb78',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 3,
                pointHoverRadius: 5,
            },
        ],
    };

    const chartOptions: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#e2e8f0',
                    font: {
                        family: 'Inter',
                        size: 12,
                        weight: 500, // 👈 nombre
                    },
                    usePointStyle: true,
                    pointStyle: 'circle', // 👈 littéral valide
                },
            },
            title: {
                display: true,
                text: t('compounder.chart.title'),
                color: '#e2e8f0',
                font: {
                    family: 'Inter',
                    size: 16,
                    weight: 600, // 👈 nombre
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
                        return `${context.dataset.label}: ${formatCurrency(
                            context.parsed.y
                        )}`;
                    },
                },
            },
        },
        scales: {
            x: {
                border: {
                    color: 'rgba(102, 126, 234, 0.2)', // ✅ déplacé ici
                },
                grid: {
                    color: 'rgba(102, 126, 234, 0.1)',
                },
                ticks: {
                    color: '#a0aec0',
                    font: {
                        family: 'Inter',
                        size: 11,
                    },
                },
            },
            y: {
                border: {
                    color: 'rgba(102, 126, 234, 0.2)', // ✅ déplacé ici aussi
                },
                grid: {
                    color: 'rgba(102, 126, 234, 0.1)',
                },
                ticks: {
                    color: '#a0aec0',
                    font: {
                        family: 'Inter',
                        size: 11,
                    },
                    callback: function (value) {
                        return formatCurrency(Number(value));
                    },
                },
            },
        },
        interaction: {
            intersect: false,
            mode: 'index',
        },
        elements: {
            point: {
                hoverBackgroundColor: '#ffffff',
            },
        },
    };

    return (
        <div className={`compounder ${className}`}>
            <div className="compounder__header">
                <h2 className="compounder__title">{t('compounder.title')}</h2>
                <p className="compounder__subtitle">
                    {t('compounder.subtitle')}
                </p>
            </div>

            <div className="compounder__content">
                {/* Section des inputs */}
                <div className="compounder__inputs">
                    <h3 className="compounder__section-title">
                        {t('compounder.sections.inputs')}
                    </h3>

                    <div className="compounder__input-group">
                        <label className="compounder__label">
                            {t('compounder.inputs.initialAmount.label')}
                            <span className="compounder__hint">
                                {t('compounder.inputs.initialAmount.hint')}
                            </span>
                        </label>
                        <input
                            type="number"
                            value={initialAmount}
                            onChange={(e) =>
                                setInitialAmount(Number(e.target.value))
                            }
                            className="compounder__input"
                            min="0"
                            max="10000000"
                            step="1000"
                        />
                    </div>

                    <div className="compounder__input-group">
                        <label className="compounder__label">
                            {t('compounder.inputs.monthlyContribution.label')}
                            <span className="compounder__hint">
                                {t(
                                    'compounder.inputs.monthlyContribution.hint'
                                )}
                            </span>
                        </label>
                        <input
                            type="number"
                            value={monthlyContribution}
                            onChange={(e) =>
                                setMonthlyContribution(Number(e.target.value))
                            }
                            className="compounder__input"
                            min="0"
                            max="50000"
                            step="50"
                        />
                    </div>

                    <div className="compounder__input-group">
                        <label className="compounder__label">
                            {t('compounder.inputs.interestRate.label')}
                            <span className="compounder__hint">
                                {t('compounder.inputs.interestRate.hint')}
                            </span>
                        </label>
                        <input
                            type="number"
                            value={interestRate}
                            onChange={(e) =>
                                setInterestRate(Number(e.target.value))
                            }
                            className="compounder__input"
                            min="0.1"
                            max="30"
                            step="0.1"
                        />
                    </div>

                    <div className="compounder__input-group">
                        <label className="compounder__label">
                            {t('compounder.inputs.timeHorizon.label')}
                            <span className="compounder__hint">
                                {t('compounder.inputs.timeHorizon.hint')}
                            </span>
                        </label>
                        <select
                            value={timeHorizon}
                            onChange={(e) =>
                                setTimeHorizon(Number(e.target.value))
                            }
                            className="compounder__select"
                        >
                            <option value={5}>5 ans</option>
                            <option value={10}>10 ans</option>
                            <option value={15}>15 ans</option>
                            <option value={20}>20 ans</option>
                            <option value={25}>25 ans</option>
                            <option value={30}>30 ans</option>
                            <option value={35}>35 ans</option>
                            <option value={40}>40 ans</option>
                        </select>
                    </div>

                    <div className="compounder__input-group">
                        <label className="compounder__label">
                            {t('compounder.inputs.compoundingFrequency.label')}
                            <span className="compounder__hint">
                                {t(
                                    'compounder.inputs.compoundingFrequency.hint'
                                )}
                            </span>
                        </label>
                        <select
                            value={compoundingFrequency}
                            onChange={(e) =>
                                setCompoundingFrequency(
                                    e.target.value as
                                        | 'monthly'
                                        | 'quarterly'
                                        | 'annually'
                                )
                            }
                            className="compounder__select"
                        >
                            <option value="monthly">
                                {t('compounder.frequencies.monthly')}
                            </option>
                            <option value="quarterly">
                                {t('compounder.frequencies.quarterly')}
                            </option>
                            <option value="annually">
                                {t('compounder.frequencies.annually')}
                            </option>
                        </select>
                    </div>
                </div>

                {/* Section des résultats */}
                <div className="compounder__results">
                    <h3 className="compounder__section-title">
                        {t('compounder.sections.results')}
                    </h3>

                    <div className="compounder__summary">
                        <div className="compounder__summary-item compounder__summary-item--primary">
                            <span className="compounder__summary-label">
                                {t('compounder.results.finalValue')}
                            </span>
                            <span className="compounder__summary-value">
                                {formatCurrency(finalAmount)}
                            </span>
                        </div>

                        <div className="compounder__summary-item">
                            <span className="compounder__summary-label">
                                {t('compounder.results.totalContributions')}
                            </span>
                            <span className="compounder__summary-value compounder__summary-value--contributions">
                                {formatCurrency(totalContributions)}
                            </span>
                        </div>

                        <div className="compounder__summary-item">
                            <span className="compounder__summary-label">
                                {t('compounder.results.interestEarned')}
                            </span>
                            <span className="compounder__summary-value compounder__summary-value--interest">
                                {formatCurrency(totalInterest)}
                            </span>
                        </div>

                        <div className="compounder__summary-item">
                            <span className="compounder__summary-label">
                                {t('compounder.results.multiplier')}
                            </span>
                            <span className="compounder__summary-value compounder__summary-value--multiplier">
                                x{(finalAmount / totalContributions).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Informations supplémentaires */}
                    <div className="compounder__info">
                        <h4 className="compounder__info-title">
                            {t('compounder.info.title')}
                        </h4>
                        <ul className="compounder__info-list">
                            <li className="compounder__info-item">
                                <span className="compounder__info-icon">
                                    ⚡
                                </span>
                                <strong>
                                    {t('compounder.info.frequency', {
                                        frequency: getFrequencyLabel(),
                                    })}
                                </strong>
                            </li>
                            <li className="compounder__info-item">
                                <span className="compounder__info-icon">
                                    📊
                                </span>
                                <strong>
                                    {t('compounder.info.rule72', {
                                        years: Math.round(72 / interestRate),
                                        rate: interestRate,
                                    })}
                                </strong>
                            </li>
                            <li className="compounder__info-item">
                                <span className="compounder__info-icon">
                                    🎯
                                </span>
                                <strong>
                                    {t('compounder.info.regularity')}
                                </strong>
                            </li>
                            <li className="compounder__info-item">
                                <span className="compounder__info-icon">
                                    ⏰
                                </span>
                                <strong>{t('compounder.info.time')}</strong>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Tableau de progression */}
                <div className="compounder__table-section">
                    <h3 className="compounder__section-title">
                        {t('compounder.sections.table')}
                    </h3>

                    {/* Graphique d'évolution */}
                    <div className="compounder__chart-container">
                        <Line data={chartData} options={chartOptions} />
                    </div>

                    <div className="compounder__table-container">
                        <table className="compounder__table">
                            <thead>
                                <tr>
                                    <th>
                                        {t('compounder.table.headers.year')}
                                    </th>
                                    <th>
                                        {t(
                                            'compounder.table.headers.startBalance'
                                        )}
                                    </th>
                                    <th>
                                        {t('compounder.table.headers.interest')}
                                    </th>
                                    <th>
                                        {t(
                                            'compounder.table.headers.contributions'
                                        )}
                                    </th>
                                    <th>
                                        {t(
                                            'compounder.table.headers.endBalance'
                                        )}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {compoundingTable.map((row) => (
                                    <tr
                                        key={row.year}
                                        className="compounder__table-row"
                                    >
                                        <td className="compounder__table-cell compounder__table-cell--year">
                                            {row.year}
                                        </td>
                                        <td className="compounder__table-cell compounder__table-cell--start">
                                            {formatCurrency(row.startBalance)}
                                        </td>
                                        <td className="compounder__table-cell compounder__table-cell--interest">
                                            {formatCurrency(row.interestEarned)}
                                        </td>
                                        <td className="compounder__table-cell compounder__table-cell--contributions">
                                            {formatCurrency(row.contributions)}
                                        </td>
                                        <td className="compounder__table-cell compounder__table-cell--end">
                                            {formatCurrency(row.endBalance)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <p className="compounder__table-note">
                        {t('compounder.table.note', {
                            rate: interestRate,
                            frequency: getFrequencyLabel().toLowerCase(),
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Compounder;
