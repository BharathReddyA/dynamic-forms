// src/reducers/companyReducer.js
const initialState = {
  companyId: null,
};

const companyReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_COMPANY_ID':
      return {
        ...state,
        companyId: action.payload,
      };
    default:
      return state;
  }
};

export default companyReducer;
