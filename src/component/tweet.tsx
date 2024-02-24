import styled from "styled-components";
import { ITweet } from "./timeline";

const Wrapper = styled.div`
	display:grid;
	grid-template-columns: 3fr 1fr;
	padding: 20px;
	border: 1px solid #e1e1e1;
	border-radius: 15px;
`;

const Column = styled.div`
	display:flex;
	flex-direction:column;
`;

const Photo = styled.img`
	width:100px;
	height:100px;
	border-radius: 15px;
`;

const Username = styled.span`
	font-weight:600;
	font-size:15px;
`;

const Payload = styled.span`
	margin: 10px 0px;
	font-size: 18px;
`;

// ITweet 인터페이스를 받아와서 사용함
export default function Tweet({username, photo, tweet}:ITweet){
	return (
		<Wrapper>
			<Column>
				<Username>{username}</Username>
				<Payload>{tweet}</Payload>
			</Column>
			<Column>
				{photo? (<Photo src={photo} />) : null}
			</Column>
		</Wrapper>
	)
}