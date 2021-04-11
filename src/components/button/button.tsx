import React, { ReactElement } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { Text } from "../../components";

type ButtonProps = {
    title: string;
} & TouchableOpacityProps;

export default function Button({ title, ...props }: ButtonProps): ReactElement {
    return (
        <TouchableOpacity {...props}>
            <Text
                style={{
                    fontSize: 25,
                    borderColor: "red",
                    borderWidth: 1,
                    marginBottom: 10,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 10,
                    paddingRight: 10
                }}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}
