const tryCatch = <Props, Result = void>({
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

export default tryCatch;
