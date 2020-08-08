export const tryCatch = <Props, Result = void>({
	tryer,
	catcher,
}: {
	tryer: (props: Props) => Result;
	catcher: (message: string, props: Props) => Result;
}) => {
	return (props: Props) => {
		try {
			return tryer(props);
		} catch (e) {
			return catcher(e.message, props);
		}
	};
};

export const conditionally = <Props, Result>(options: {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	if: (props: Props) => any;
	then: (props: Props) => Result;
	else: (props: Props) => Result;
	fail?: (error: string, props: Props) => void;
}) => (props: Props) => {
	try {
		return options.if(props) ? options.then(props) : options.else(props);
	} catch (err) {
		if (options.fail) {
			options.fail(err.message, props);
		}
	}
	return null;
};
