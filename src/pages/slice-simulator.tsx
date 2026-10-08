import { SliceSimulator } from "@prismicio/next/pages";
import { SliceZone } from "@prismicio/react";

import { components } from "../slices";

export default function SliceSimulatorPage() {
	return (
		<SliceSimulator
			sliceZone={(props) => <SliceZone {...props} components={components} />}
		/>
	);
}