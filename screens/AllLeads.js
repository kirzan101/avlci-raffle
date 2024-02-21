import { useContext, useEffect, useState } from 'react';
import LeadsOutput from '../components/LeadsOutput/LeadsOutput';
import { LeadsContext } from '../store/leads-context';
import { leadsFetch } from '../database/leadsData';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { getFormattedDate } from '../util/date';

function AllLeads() {
  const leadsCtx = useContext(LeadsContext);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [filterDate, setFilterDate] = useState('');
  const [search, setSearch] = useState('');
  const [filteredLeads, setFilteredLeads] = useState([]);

  useEffect(() => {
    getLeads();
  }, []);

  async function getLeads() {
    const leads = await leadsFetch();
    leadsCtx.setLeads(leads);
    setFilteredLeads(leads);
  }

  // search filter
  const searchFilter = (val) => {
    setSearch(val);
    const results = handleFilter(filterDate, val);
    setFilteredLeads(results);
  };

  // date filter
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    hideDatePicker();
    const pickedDate = getFormattedDate(new Date(date));
    setFilterDate(pickedDate);

    const results = handleFilter(pickedDate, search);
    setFilteredLeads(results);
  };

  function removeFilterHandler() {
    setFilterDate('');
    setSearch('');
    getLeads(); // fetch leads
  }

  function handleFilter(dateVal, searchVal) {
    const dateFilter = dateVal ? dateVal : '';
    const searchFilter = searchVal ? searchVal : '';

    if (searchFilter.length > 0 && dateFilter.length == 0) {
      // if search has value and date has NO value
      const newLeadsCtx = leadsCtx.leads.filter((leads) => {
        return (
          leads.first_name.includes(searchFilter) ||
          leads.last_name.includes(searchFilter)
        );
      });

      return newLeadsCtx;
    } else if (searchFilter.length == 0 && dateFilter.length > 0) {
      // if search has NO value and date has value
      const newLeadsCtx = leadsCtx.leads.filter((leads) => {
        const createdDate = getFormattedDate(new Date(leads.created_at));

        return createdDate == dateFilter;
      });

      return newLeadsCtx;
    } else if (searchFilter.length > 0 && dateFilter.length > 0) {
      // if search and date has value
      const newLeadsCtx = leadsCtx.leads.filter((leads) => {
        const createdDate = getFormattedDate(new Date(leads.created_at));

        return (
          createdDate == dateFilter &&
          (leads.first_name.includes(searchFilter) ||
            leads.last_name.includes(searchFilter))
        );
      });

      return newLeadsCtx;
    }

    // return defaults
    return leadsCtx.leads;
  }

  const leadsPeriodText =
    filterDate.length > 0 || search.length > 0
      ? 'Showing filtered leads'
      : 'Showing all leads';

  // return <LeadsOutput leads={leadsCtx.leads} leadsPeriod="Total" fallbackText="No registered leads" />;
  return (
    <>
      <LeadsOutput
        leads={filteredLeads}
        leadsPeriod={leadsPeriodText}
        fallbackText="No registered leads"
        pickedDate={filterDate}
        filterButton={showDatePicker}
        removeFilter={removeFilterHandler}
        search={search}
        searchHandler={searchFilter}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
    </>
  );
}

export default AllLeads;
