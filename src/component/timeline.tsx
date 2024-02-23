import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";


// ts로 데이타 정의
export interface ITweet{
	id: string;
	photo: string;
	tweet: string;
	userId: string;
	username: string;
	createdAt:number;
}

const Wrapper = styled.div`
	
`;

export default function Timeline(){
	const [tweets, setTweets] = useState<ITweet[]>([]); // react에게 이건 tweet 배열이며, 기본값은 빈배열이라고 알려줌
	const fetchTweets = async () => {
		const tweetQuery = query(
			collection(db, "tweets"),
			orderBy("createdAt", "desc"),
		);

		const snapshot = await getDocs(tweetQuery);
		//snapshot.docs.forEach(doc => console.log(doc.data()));
		const tweets = snapshot.docs.map((doc)=>{
			const {tweet, createdAt, userId, username, photo} = doc.data(); // ITweet에 정의된 변수에 doc.data()로 가져온 값을 넣어줌
			return {
				id: doc.id,
				photo,
				tweet,
				userId,
				username,
				createdAt,
			}
		});
		// map은 map안의 함수에서 반환한 항목을 가지고 새로운 배열을 만들어냄
		// ITweet에 지정된 형식의 변수에 데이타를 넣어주는 것임

		setTweets(tweets); // map에서 가져온 tweets를 setTweets로 넣어줌

	}
	// 비동기 함수 생성

	useEffect(()=>{
		fetchTweets();
	},[]);
	// useEffect로 fetchTweets를 실행함

	return(
		<Wrapper>
			{tweets.map((tweet) => (
				<Tweet key={tweet.id} {...tweet} />	
			))}
			{/* tweet.id를 key로 해서 Tweet컴포넌트를 랜더링 하는 것임 */}
		</Wrapper>
	)
}