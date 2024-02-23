import { useState } from 'react';
import {styled} from 'styled-components'
import { auth, db, storage } from '../firebase';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Form = styled.form`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

const Textarea = styled.textarea`
	border:2px solid white;
	padding: 20px;
	border-radius: 20px;
	font-size:16px;
	color: white;
	background-color:black;
	width: 100%;
	resize: none;
	&::placeholder{
		font-size: 16px;
		font-family: system-ui, -apple-system, "Noto Sans KR", sans-serif;
	}
	&:focus{
		outline: none;
		border-color:#1d9bf0;
	}
`;

const AttachFileButton = styled.label`
	padding: 10px 0px;
	color:#1d9bf0;
	text-align: center;
	border-radius: 20px;
	border:1px solid #1d9bf0;
	font-size:14px;
	font-weight: 600;
	cursor: pointer;
`;

const AttachFileInput = styled.input`
	display: none;
`;

const SubmitBtn = styled.input`
	background-color: #1d9bf0;
	color: white;
	border: none;
	padding: 10px 0px;
	border-radius: 20px;
	font-size: 16px;
	cursor: pointer;
	&:hover,
	&:active{
		opacity: 0.9;
	}
`;


export default function PostTweetForm(){
	const [isLoading, setLoading] = useState(false);
	const [tweet, setTweet] = useState("");
	const [file, setFile] = useState<File | null>(null); // typescript구문으로 file이나 null로 지정된다는 것임
	const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTweet(e.target.value);
	}
	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if(files && files.length === 1){ // 1개의 파일만 선택할수 있도록 함
			setFile(files[0]);
		}	
	}

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const user = auth.currentUser;
		
		if(!user || isLoading || tweet === "" || tweet.length > 180) return; // 로딩중이거나, 트윗이 비어있거나, 180자 이상이면 return
		try{
			setLoading(true);

			const doc = await addDoc(collection(db, "tweets"), {
				tweet,
				createdAt:Date.now(),
				username: user.displayName || "Anonymous",
				userId: user.uid,
			});
			// tweets collection으로 접근해서 addDoc으로 추가함
			// tweets로 지정하면 collection은 같이 생성이 된다.
			// tweet는 textarea의 내용을 useState로 받아서 가져온 것임
			// noSQL이라서 아래처럼 json 형식으로 데이타를 구성해서 insert 시키면 됨


			if(file){
				const locationRef = ref(storage, `tweets/${user.uid}/${doc.id}`); // doc.id로 파일명으로 함. 하나일때만 가능
				// user.displayName
				const result  = await uploadBytes(locationRef, file);
				const url = await getDownloadURL(result.ref);
				await updateDoc(doc,{
					photo: url,
					}
				);

				setTweet(""); // 업로드후 초기화
				setFile(null); // file도 초기화
			}
			// storage에 파일을 업로드하는 과정임
		}
		catch(e){
			console.log(e);
		}finally{
			setLoading(true);
		}	
	}
	return(
		<Form onSubmit={onSubmit}>
			<Textarea rows={5} maxLength={180} onChange={onChange} value={tweet} placeholder="What is hanppening?" />
			<AttachFileButton htmlFor="file">{ file? "Photo Added" : "Add photo"}</AttachFileButton>
			<AttachFileInput onChange={onFileChange} type="file" id="file" accept="image/*" />
			<SubmitBtn type="submit" value={isLoading ? "Posting" : "Post Tweet"}/>
		</Form>
	) ;
}