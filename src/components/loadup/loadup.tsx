import React, { ReactElement, ReactNode, useState, useEffect } from "react";
import { useFonts, Actor_400Regular } from "@expo-google-fonts/actor";
import AppLoading from "expo-app-loading";
import { Auth, Hub } from "aws-amplify";
import { useLogged } from "../../contexts/logged-context";

type LoadUpProps = {
	children: ReactNode;
};

export default function LoadUp({ children }: LoadUpProps): ReactElement {
	const [fontLoaded] = useFonts({
		Actor_400Regular,
	});
	const [logged, setLogged] = useState(false);
	const { setUser } = useLogged();
	useEffect(() => {
		const loginStatus = async () => {
			try {
				const user = await Auth.currentAuthenticatedUser();
				setUser(user);
				console.log("HELLLOOOO");
			} catch (err) {
				console.log(err);
			}
			setLogged(true);
		};
		loginStatus();
		const hubListener = (hubData: any) => {
			const { data, event } = hubData.payload;
			if (event == "signOut") {
				setUser(null);
			} else if (event == "signIn") {
				setUser(data);
			}
		};
		Hub.listen("auth", hubListener);
		return () => {
			Hub.remove("auth", hubListener);
		};
	}, []);
	return fontLoaded && logged ? <>{children}</> : <AppLoading />;
}
