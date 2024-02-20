import { Outlet } from "react-router-dom";

export default function Layout() {
	return (
		<>
			<h2>layout</h2>
			<Outlet/> {/* home component를 render하게 됨*/}
			{/* <Outlet/> 컴포넌트는 React Router v6 이상에서 사용되며, 중첩된 라우트의 구성요소를 렌더링하는 데 사용된다. */}
			{/* Outlet은 부모 라우트 내에서 자식 라우트의 컴포넌트를 렌더링할 위치를 정의하며, 이를 통해 중첩된 라우팅 구조를 구현할 수 있으며, 애플리케이션의 라우트 계층을 더 유연하게 관리할 수 있다 */}
		</>
	);
}