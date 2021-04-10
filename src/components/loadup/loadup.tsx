import React, { ReactElement, ReactNode } from "react";
import { useFonts, Actor_400Regular } from "@expo-google-fonts/actor";
import AppLoading from "expo-app-loading";

type LoadUpProps = {
	children: ReactNode;
};

export default function LoadUp({ children }: LoadUpProps): ReactElement {
	const [fontLoaded] = useFonts({
		Actor_400Regular,
	});
	return fontLoaded ? <>{children}</> : <AppLoading />;
}
