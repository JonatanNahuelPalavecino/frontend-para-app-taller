import { createContext, useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { notifyError } from "../Notificacion/Notificacion";


export const Context = createContext()

export const ContextProvider = ({ children }) => {

    const [user, setUser] = useState(() => {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    });
    const [pedido, setPedido] = useState({
      state: false,
      fecha: "", 
      tipo_solicitud: null,
      user: user?.nombre,
      base_operativa: null, 
      mov_ax: "",
      comentario: ""
    })
    const [loading, setLoading] = useState(false)
    const [openDialog, setOpenDialog] = useState(false);
    const [cobranzaMessage, setCobranzaMessage] = useState([]);
    const [progreso, setProgreso] = useState(false)
  
    useEffect(() => {
        
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }

    }, [user]);

    const clearUserData = () => {
        setUser(null);
        localStorage.clear();
      };
  
    const verifyToken = async () => {
      if (!user || !user.token) {
        clearUserData()
        return false;
      }
  
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER}/auth/protected`, {
          method: "GET",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
        });
  
        if (response.status === 500) {
            notifyError("Token vencido. Vuelva a iniciar Sesión")
            clearUserData()
            return false;
        }
  
        const data = await response.json();

        if (data.estado === "error") {
            notifyError(data.mensaje)
            clearUserData()
            return false
        }

        return true
  
      } catch (error) {
        console.log(error);
        notifyError(error)
        clearUserData()
        return false
      }
    };

    return(
        <Context.Provider value={{
            pedido, 
            setPedido,
            loading, 
            setLoading,
            user,
            setUser,
            verifyToken,
            openDialog, 
            setOpenDialog,
            cobranzaMessage, 
            setCobranzaMessage,
            progreso, 
            setProgreso
        }}>
            {children}
        </Context.Provider>
    );
}

ContextProvider.propTypes = {
    children: PropTypes.node.isRequired, // 'children' es un nodo requerido
};