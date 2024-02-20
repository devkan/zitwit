import { Navigate } from "react-router-dom";
import { auth } from "../firebase";

export default function Protect({children}:{children:React.ReactNode} ){
	const user = auth.currentUser;
	//console.log(user);
	if(user === null){
		return <Navigate to="/login"/>; // 로그인 페이지로 이동
	}

	return children;
}