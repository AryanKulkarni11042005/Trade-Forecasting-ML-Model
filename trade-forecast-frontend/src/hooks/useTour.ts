import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import { useCallback } from 'react';

export const useTour = () => {
  const startTour = useCallback(() => {
    const driverObj = driver({
      showProgress: true,
      animate: true,
      overlayColor: 'rgba(0, 0, 0, 0.75)',
      steps: [
        {
          element: '#nav-dashboard',
          popover: {
            title: 'Insights Dashboard',
            description: 'Get an bird\'s-eye view of current and predicted trade deficits, risk levels, and AI model performance.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#nav-forecast',
          popover: {
            title: 'Deficit Forecasts',
            description: 'View chronological predictions with confidence intervals. See how our AI expects the market to shift over the coming months.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#nav-simulator',
          popover: {
            title: 'Scenario Simulator',
            description: 'The most powerful tool in your arsenal. Model "What-If" scenarios by adjusting oil prices, currency rates, and international trade volumes.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#nav-explainability',
          popover: {
            title: 'AI Explainability',
            description: 'Understand the "Why" behind the "What." Discover which factors are driving the current forecasts.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#nav-explorer',
          popover: {
            title: 'Data Explorer',
            description: 'Deep dive into the raw datasets. Export historical records and audit the training data used by our models.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#nav-about',
          popover: {
            title: 'Our Story',
            description: 'Learn about the 2026 landmark trade deal and the vision that led to the creation of TradeCast.',
            side: 'right',
            align: 'start',
          },
        },
        {
          element: '#header-currency',
          popover: {
            title: 'Global Currency Support',
            description: 'Instantly toggle between INR and USD. All calculations and charts update dynamically.',
            side: 'bottom',
            align: 'end',
          },
        },
        {
          element: '#header-theme',
          popover: {
            title: 'Visual Comfort',
            description: 'Switch between Light and Dark mode to suit your preference.',
            side: 'bottom',
            align: 'end',
          },
        },
      ],
      onDestroyed: () => {
        localStorage.setItem('has_seen_tour', 'true');
      },
    });

    driverObj.drive();
  }, []);

  const checkAndStartTour = useCallback(() => {
    const hasSeenTour = localStorage.getItem('has_seen_tour');
    if (!hasSeenTour) {
      setTimeout(startTour, 1000); // Small delay to let animations settle
    }
  }, [startTour]);

  return { startTour, checkAndStartTour };
};
