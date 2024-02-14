import { useContext, useEffect, useState } from 'react';
import LeadsOutput from '../components/LeadsOutput/LeadsOutput';
import { LeadsContext } from '../store/leads-context';
import { leadsFetch } from '../database/leadsData';

function AllLeads() {
  const leadsCtx = useContext(LeadsContext);
  // const [fetchedLeads, setFetchedLeads] = useState([]);

  useEffect(() => {
    async function getLeads() {
      const leads = await leadsFetch();
      leadsCtx.setLeads(leads);
    }

    getLeads();
  }, []);

  // return <LeadsOutput leads={leadsCtx.leads} leadsPeriod="Total" fallbackText="No registered leads" />;
  return (
    <LeadsOutput
      leads={leadsCtx.leads}
      leadsPeriod="Showing all leads"
      fallbackText="No registered leads"
    />
  );
}

export default AllLeads;
