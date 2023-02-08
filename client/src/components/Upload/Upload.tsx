import { Box, Button, Chip, Stack } from "@mui/material";
import React, { useRef, useState } from "react";
import { getFileName } from "../../utils/Formatting";
import MatIcon from "../MatIcon/MatIcon";

interface UploadProps {
  text: string;
  value: File[];
  onChange: (file: File[]) => void;
}

const Upload = ({ text, onChange: setValue, value }: UploadProps) => {
  const input = useRef(null);

  const filesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;

    if (file) {
      setValue(
        [...value, ...Array.from(file)].filter(
          (val, index, self) =>
            index === self.findIndex((t) => t.name === val.name)
        )
      );
    }
  };

  const handleClick = () => {
    //@ts-ignore
    input.current.click();
  };

  return (
    <Stack style={{ width: "100%" }} className="gap-1">
      <Box className="flex gap-1 flex-wrap">
        {value.map((v) => (
          <Chip
            onDelete={() => setValue(value.filter((f) => f.name !== v.name))}
            label={getFileName(v.name)}
            key={v.name}
            color="primary"
          />
        ))}
      </Box>
      <Box>
        <Button
          variant="outlined"
          onClick={handleClick}
          style={{ width: "100%" }}
        >
          <MatIcon color="primary">attach_file</MatIcon>
          {text}
        </Button>
      </Box>
      <input
        ref={input}
        id="file"
        multiple={true}
        type="file"
        style={{ display: "none" }}
        onChange={(e) => filesSelected(e)}
      />
    </Stack>
  );
};

export default Upload;
