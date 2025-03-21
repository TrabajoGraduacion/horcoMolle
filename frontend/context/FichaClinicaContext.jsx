import React, { createContext, useState } from 'react';

export const FichaClinicaContext = createContext();

export const FichaClinicaProvider = ({ children }) => {
  const [fichaClinicaActual, setFichaClinicaActual] = useState(null);

  return (
    <FichaClinicaContext.Provider value={{ fichaClinicaActual, setFichaClinicaActual }}>
      {children}
    </FichaClinicaContext.Provider>
  );
};