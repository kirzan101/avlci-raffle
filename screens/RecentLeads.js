import { useContext } from 'react';

import { LeadsContext } from '../store/leads-context';
import LeadsOutput from '../components/LeadsOutput/LeadsOutput';
import { getDateMinusDays } from '../util/date';

function RecentLeads() {
  const leadsCtx = useContext(LeadsContext);

  const recentLeads = leadsCtx.leads.filter((leads) => {
    const today = new Date();
    const date7daysAgo = getDateMinusDays(today, 7);

    return new Date(leads.created_at) > date7daysAgo;
  });

  return (
    <LeadsOutput
      leads={recentLeads}
      leadsPeriod="Last 7 days"
      fallbackText="No leads registered for the last 7 days"
    />
  );
}

export default RecentLeads;
