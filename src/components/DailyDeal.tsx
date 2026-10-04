import React from 'react';

/**
 * Placeholder component for a daily featured car deal.
 * This simple component can be expanded later with real data fetching
 * and styling. For now it just displays a static message.
 */
const DailyDeal: React.FC = () => {
  return (
    <div style={{ padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
      <h2>Daily Deal</h2>
      <p>Check back later for today's featured car!</p>
    </div>
  );
};

export default DailyDeal;
