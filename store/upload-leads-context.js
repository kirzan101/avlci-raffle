const { createContext, useReducer, useState } = require("react");

export const UploadLeadsContext = createContext({
  leads: [],
  addLead: ({
    first_name,
    middle_name,
    last_name,
    companion_first_name,
    companion_middle_name,
    companion_last_name,
    address,
    hotel,
    mobile_number,
    occupation,
    age,
    source_prefix,
    source,
    civil_status,
    is_uploaded,
    created_at,
  }) => {},
  setLeads: (leads) => {},
  deleteLead: (id) => {},
  updateLead: (
    id,
    {
      first_name,
      middle_name,
      last_name,
      companion_first_name,
      companion_middle_name,
      companion_last_name,
      address,
      hotel,
      mobile_number,
      occupation,
      age,
      source_prefix,
      source,
      civil_status,
      is_uploaded,
      created_at,
    }
  ) => {},
});

function leadReducer(state, action) {
  switch (action.type) {
    case "ADD":
      const id = new Date().toString() + Math.random().toString();
      return [{ ...action.payload, id: id }, ...state];
    case "SET":
      const inverted = action.payload.reverse();
      return inverted;
    case "UPDATE":
      const updatableLeadIndex = state.findIndex(
        (lead) => lead.id === action.payload.id
      );
      const updatableLead = state[updatableLeadIndex];
      const updatedItem = { ...updatableLead, ...action.payload.data };
      const updatedLeads = [...state];
      updatedLeads[updatableLeadIndex] = updatedItem;
      return updatedLeads;
    case "DELETE":
      return state.filter((lead) => lead.id !== action.payload);
    default:
      return state;
  }
}

function UploadLeadsContextProvider({ children }) {
  const [leadsState, dispatch] = useReducer(leadReducer, []);

  function addLead(leadData) {
    dispatch({ type: "ADD", payload: leadData });
  }

  function setLeads(leads) {
    dispatch({ type: "SET", payload: leads });
  }

  function deleteLead(id) {
    dispatch({ type: "DELETE", payload: id });
  }

  function updateLead(id, leadData) {
    dispatch({ type: "UPDATE", payload: { id: id, data: leadData } });
  }

  const value = {
    leads: leadsState,
    addLead: addLead,
    setLeads: setLeads,
    deleteLead: deleteLead,
    updateLead: updateLead,
  };

  return (
    <UploadLeadsContext.Provider value={value}>{children}</UploadLeadsContext.Provider>
  );
}

export default UploadLeadsContextProvider;
