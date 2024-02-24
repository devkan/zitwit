import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Tweet from "./tweet";
import { Unsubscribe } from "firebase/auth";


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
	display:flex;
	gap: 20px;
	flex-direction: column;
`;

export default function Timeline(){
	const [tweets, setTweets] = useState<ITweet[]>([]); // react에게 이건 tweet 배열이며, 기본값은 빈배열이라고 알려줌


	useEffect(()=>{
		let unsubscribe : Unsubscribe | null = null; // unsubscribe의 타입은 Unsubscribe이거나 null로 지정한다.
		const fetchTweets = async () => {
			const tweetQuery = query(
				collection(db, "tweets"),
				orderBy("createdAt", "desc"),
				limit(25)
			);
			// query 생성해서 docs로 보내 데이타를 조회해서 가져오게 된다.
	
			/*
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
			*/
	
			// 위 코드는 문서를 한번 조회해서 가져오는 것이고, 아래것은 쿼리에 리스터를 달아서 실시간으로 가져오는 것임
			// 추가/삭제도 되어도 실시간으로 반영이 됨
			unsubscribe = await onSnapshot(tweetQuery, (snapshot) => {
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
				setTweets(tweets); // map에서 가져온 tweets를 setTweets로 넣어줌
			});
			// https://firebase.google.com/docs/firestore/query-data/listen?hl=ko
			// onSnapshot 실시간으로 데이타를 가져오지만, 읽을때마다 비용이 지불됨. (비용은 적지만..)
			// 그래서 unsubscribe로 리스너를 해제해주는 것이 좋음
	
		}
		// 비동기 함수 생성

		fetchTweets();

		return()=>{
			unsubscribe && unsubscribe();
			// unsubscribe가 null이 아니면 unsubscribe를 실행하게 됨
			// useEffect의 teardonw, cleanup기능을 사용해서 리스너를 해제해주는 것임
			// userEffect는 유저가 화면을 보지 않을때 값을 반환하면서 cleanup을 실행함
		}
	},[]);
	// useEffect로 fetchTweets를 실행함
	// onSnapshot를 사용하면 실시간 업데이트가 가능해서 편하기는 한데, 비용 발생이 생기거나 필요없이 리스터가 계속 돌아가니..
	// useEffect 내부로 snapshot을 가져가 거기서 unsubscribe를 지정해 필요시에만 리스너가 돌아가게 함

	return(
		<Wrapper>
			{tweets.map((tweet) => (
				<Tweet key={tweet.id} {...tweet} />	
			))}
			{/* tweet.id를 key로 해서 Tweet컴포넌트를 랜더링 하는 것임 */}
		</Wrapper>
	)
}