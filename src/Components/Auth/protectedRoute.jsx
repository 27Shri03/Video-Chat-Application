import { Navigate } from "react-router-dom";
import {useUserData}  from "../Context/UserData.context.jsx";
export default function Protected({ children }) {
    const { islogin } = useUserData();
    return islogin.current ? children : <Navigate to='/login' replace />;
}