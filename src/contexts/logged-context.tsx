import React, { useState, createContext, useContext, Dispatch, SetStateAction, ReactNode, ReactElement } from "react";

type LoggedContextType = {
	user: { [key: string]: any } | null;
	setUser: Dispatch<SetStateAction<{ [key: string]: any } | null>>;
};

const LoggedContext = createContext<LoggedContextType | undefined>(undefined);

const useLogged = (): LoggedContextType => {
	const context = useContext(LoggedContext);
	if (!context) {
		throw new Error("coming from the logged context file!");
	}
	return context;
};

const LoggedProvider = (props: { children: ReactNode }): ReactElement => {
	const [user, setUser] = useState<{ [key: string]: any } | null>(null);
	return <LoggedContext.Provider {...props} value={{ user, setUser }}></LoggedContext.Provider>;
};

export { useLogged, LoggedProvider };
