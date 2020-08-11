const conditionally = <Props, Result>(options: {
	if: (props: Props) => boolean;
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

export default conditionally;
