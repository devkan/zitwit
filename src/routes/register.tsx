import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { styled } from "styled-components";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";

const Wrapper = styled.div`
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 420px;
	padding: 50px 0px;
`;
const Title = styled.h1`
	font-size: 42px;
`;
const Form = styled.form`
	margin-top: 50px;
	display: flex;
	flex-direction: column;
	gap: 10px;
	width: 100%;
`;
const INPUT = styled.input`
	padding: 10px 20px;
	border-radius: 50px;
	border: none;
	width: 100%;
	font-size: 16px;
	&[type="submit"] {
		cursor: pointer;
		&:hover {
			opacity: 0.8;
		}
	}
`;

const Error = styled.span`
	font-weight: 600;
	color: tomato;
`;

export default function Signin(){
	const navigate = useNavigate(); // useNavigate를 사용하여 페이지를 이동시킴. hook
	const [isLoading, setLoading] = useState(false); // 계정 생성후 state를 true로 변경할 것임
	const [name, setName] = useState(""); // state에 연결시킴
	const [email, setEmail] = useState(""); // state에 연결시킴
	const [password, setPassword] = useState(""); // state에 연결시킴
	const [error, setError] = useState(""); // state에 연결시킴

	// change listener
	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target: { name, value } } = e;
		if(name === "name") setName(value);
		else if(name === "email") setEmail(value);
		else if(name === "password") setPassword(value);
	};
	// name을 지정함으로써, value가 변경되었을때 어떤 input이 변경되었는지 찾을수 있고, 각각의 state를 통해 set을 해 주게 됨

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		//console.log(name, email, password);

		if(isLoading || name === "" || email === "" || password === "") return;

		try {
			setLoading(true);
			//create account
			const credentials = await createUserWithEmailAndPassword(auth, email, password);
			console.log(credentials.user);
			
			// set the name of the user
			await updateProfile(credentials.user, { displayName: name });

			// redirect to the home
			navigate("/");

		}catch(e){
			if(e instanceof FirebaseError){	
				console.log(e.code, e.message); // error code, error message
				//setError(e.message);
			}
		}finally{
			setLoading(false);
		}
	};

	return (
		<Wrapper>
			<Title>Regist ZiTwit</Title>
			<Form onSubmit={onSubmit}>
				<INPUT name="name" value={name} onChange={onChange} placeholder="Name" type="text" required/>
				<INPUT name="email" value={email} onChange={onChange} placeholder="Email" type="email" required/>
				<INPUT name="password" value={password} onChange={onChange} placeholder="Password" type="password" required />
				<INPUT type="submit" value={isLoading? "Loading" : "Regist"}/>
			</Form>
			{error !== ""? <Error>{error}</Error> : null}
		</Wrapper>		
	);
}