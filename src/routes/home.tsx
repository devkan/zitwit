import PostTweetForm from "../component/post-tweet-form";
import {styled} from "styled-components";

const Wrapper = styled.div``;

export default function Home(){
	return(
		<Wrapper>
			<PostTweetForm/>
		</Wrapper>	
	)
}