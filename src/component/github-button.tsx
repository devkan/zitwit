import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import {styled} from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const Button = styled.span`
	margin-top: 50px;
	background-color: white;
	width: 100%;
	color: #2a2a2a;
	font-weight: 500;
	padding: 10px 20px;
	border-radius: 50px;
	border:0;
	display: flex;
	gap:5px;
	align-items: center;
	justify-content: center;
	cursor: pointer;
`

const Logo = styled.img`
	height: 25px;
`
	

export default function GithubButton(){
	const navigate = useNavigate();
	const onClick = async () => {
		try{
			const provider = new GithubAuthProvider();
			await signInWithPopup(auth, provider); 
			// signInWithRedirect 는 현재창에서 인증을 함. import { signInWithRedirect } from "firebase/auth"; 추가해야 됨
			navigate("/");
		}catch(error){
			console.error(error);
		}
	}
	return(
		<Button onClick={onClick}>
			<Logo src="/github-mark.svg"/>
			Continue with Github
		</Button>
	);
}