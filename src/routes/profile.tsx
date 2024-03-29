import styled from "styled-components";
import {auth, db, storage} from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore";
import { ITweet } from "../component/timeline";
import Tweet from "../component/tweet";
import { FirebaseError } from "firebase/app";

const Wrapper = styled.div`
	display:flex;
	align-items:center;
	flex-direction:column;
	gap:20px;
`;

const AvatarUpload = styled.label`
	width:80px;
	overflow:hidden;
	height:80px;
	border-radius:50%;
	background-color: #1d9bf0;
	cursor:pointer;
	display:flex;
	justify-content:center;
	align-items:center;
	svg{
		width:50px;
		fill:white;
	}
`;

const AvatarImg = styled.img`
	width:100%;
`;

const AvatarInput = styled.input`
	display:none;

`;

const Name = styled.span`
	font-size:22px;
`;

const Tweets = styled.div`
	display:flex;
	width:100%;
	flex-direction:column;
	gap:20px;
`;

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 10px;
	align-items: center;
	width: 100%;
`;

const ModifyButton = styled.button`
	background-color: #1d9bf0;
	color:white;
	font-weight:600;
	border:0;
	font-size:12px;
	padding: 5px 10px;
	text-transform:uppercase;
	border-radius:5px;
	cursor:pointer;
`;

const INPUT = styled.input`
	padding: 10px 20px;
	border-radius: 50px;
	border: none;
	width: 50%;
	font-size: 16px;
	&[type="submit"] {
		cursor: pointer;
		&:hover {
			opacity: 0.8;
		}
	}
`;

const SubmitButton = styled.button`
	background-color: #1d9bf0;
	color:white;
	font-weight:600;
	border:0;
	font-size:12px;
	padding: 5px 10px;
	text-transform:uppercase;
	border-radius:5px;
	cursor:pointer;
	width: 20%;
`;



export default function Profile(){
	const user = auth.currentUser;
	const [avatar, setAvatart] = useState(user?.photoURL);
	const onAvatarChange = async(e:React.ChangeEvent<HTMLInputElement>) => {
		const {files} = e.target;
		if(!user) return;

		if(files && files.length === 1){
			const file = files[0];
			const locationRef = ref(storage, `avatars/${user?.uid}`);
			const result = await uploadBytes(locationRef, file)
			const avatarUrl = await getDownloadURL(result.ref);
			setAvatart(avatarUrl);

			await updateProfile(user, {photoURL: avatarUrl});
			// updateProfile는 firebase/auth에서 가져온 함수인데.. 왜 이렇게 사용하는지는 모르겠음
		}
		// 선택된 파일을 바로 서버로 업로드하는 코드로 avatars에 유저 아이디로 저장하는 것임.
		// post-tweet-form.tsx에서도 파일을 업로드하는 코드가 있으니 참조하자.(96라인쯤)
	};

	const DefaultAvatar = () => (
		<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
			<path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" />
		</svg>
	);
	// const defaultAvatar = '<svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 0 0-13.074.003Z" /></svg>';
	// 이처럼 지정하면 스트링으로 인식해서 이미지가 나오지 않고, 코드형태로 출력됨
	// 그래서 React 컴포넌트로 만들어서 사용했음



	const [tweets, setTweets] = useState<ITweet[]>([]);
	// useState로 tweets를 ITweet배열로 지정하고, 기본값은 빈배열로 지정함
	// 다시 말해 이것들은 배열로 호출되는 인터페이스를 갖게 될것이고, 빈 배열로 시작한다는 뜻이다.

	//자신의 tweet를 가져오기
	const fetchTweets = async() => {
		const tweetQuery = query(
			collection(db, "tweets"),
			where("userId", "==", user?.uid), // fireabse에서 index를 생성해 줘야 한다.
			orderBy("createdAt", "desc"),
			limit(25)
		);

		const snapshot = await getDocs(tweetQuery);
		const tweets = snapshot.docs.map(doc=>{
			const {tweet, createdAt, userId, username, photo} = doc.data();
			return {
				id: doc.id,
				photo,
				tweet,
				userId,
				username,
				createdAt,
			};
		});
		setTweets(tweets);
	};

	useEffect(()=>{
		fetchTweets();
	}, []);


	// name modify
	const [isEditing, setIsEditing] = useState(false);
	const [modifyName, setModifyName] = useState(user?.displayName); // state에 연결시킴
	const [isLoading, setLoading] = useState(false); // 계정 생성후 state를 true로 변경할 것임
	const [, setError] = useState(""); // 시용하지 않아서 error 제거함

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };


	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { target: { name, value } } = e;
		if(name === "modify_name") setModifyName(value);
	};

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

		const user = auth.currentUser;
		if(!user) return;

		if(isLoading || modifyName === "") return;

		try {
			setLoading(true);
			await updateProfile(user, { displayName: modifyName});
		}catch(e){
			if(e instanceof FirebaseError){	
				//console.log(e.code, e.message); // error code, error message
				setError(e.message);
			}
		}finally{
			setLoading(false);

			setModifyName(modifyName); // 서버로부터 받은 새 닉네임으로 상태 업데이트
			setIsEditing(false); // 수정 모드 종료	
		}
	};
	

	return (
		<Wrapper>
			<AvatarUpload htmlFor="avatar">
				{avatar ? (<AvatarImg src={avatar}/>) : (<DefaultAvatar />)}
			</AvatarUpload>
			<AvatarInput onChange={onAvatarChange} id="avatar" type="file" accept="image/*"/>
			{!isEditing ? (
				<Name>
					{user?.displayName?? "Anonymous"}
					{/* {user?.displayName?user.displayName: "Anonymous"} 를 축약한 것임 */}
					<ModifyButton onClick={handleEditClick}>Modify</ModifyButton>
				</Name>
				) : (
				<Form onSubmit={onSubmit}>
					<INPUT name="modify_name" value={modifyName ?? ''} onChange={onChange} type="text" required/>
					{/* value={modifyName}로 지정하면 오류가 발생한다. */}
					<SubmitButton type="submit">{isLoading? "Loading" : "Modify"}</SubmitButton>
				</Form>			
				)
			}

			<Tweets>
				{tweets.map(tweet=><Tweet key={tweet.id} {...tweet}/>)}
			</Tweets>
		</Wrapper>
	);
}