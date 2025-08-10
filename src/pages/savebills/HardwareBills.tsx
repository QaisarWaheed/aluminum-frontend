import { useState } from "react";
import { TextInput } from "@mantine/core";

const HardwareBills = () => {
  const [value, setValue] = useState("");
  return (
    <TextInput
      value={value}
      placeholder="Search hardware bills"
      onChange={(event) => setValue(event.currentTarget.value)}
      m={"md"}
    />
  );
};
export default HardwareBills;
