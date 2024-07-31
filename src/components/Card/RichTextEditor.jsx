import { useState, useEffect } from "react";
import { useColorScheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import "../../assets/css/Card/RichTextEditor.css";

const RichTextEditor = ({
  toggleOpenDescriptionFieldCard,
  descriptionCardToDisplay,
  inputDescriptionCard,
  handleChangesDescriptionCard,
}) => {
  const colorScheme = useColorScheme();

  const [editorValue, setEditorValue] = useState("");

  useEffect(() => {
    setEditorValue(inputDescriptionCard);
  }, [inputDescriptionCard]);

  const handleEditorChange = (value) => {
    setEditorValue(value);
  };

  return (
    <Box>
      <ReactQuill
        placeholder="Type description here..."
        value={editorValue}
        onChange={handleEditorChange}
        className={
          colorScheme.mode === "dark"
            ? "quill-description dark-theme"
            : "quill-description light-theme"
        }
      />

      {/* save and cancel btn */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          mt: 2,
          gap: 1.5,
        }}
      >
        <Box
          onClick={() => {
            if (editorValue && editorValue != descriptionCardToDisplay) {
              handleChangesDescriptionCard(editorValue);
            }
            toggleOpenDescriptionFieldCard();
          }}
          sx={{
            cursor: "pointer",
            px: 1.75,
            py: 0.75,
            fontSize: ".9rem",
            fontWeight: "bold",
            borderRadius: "5px",
            color: (theme) => theme.trelloCustom.COLOR_7115BA,
            bgcolor: (theme) => theme.trelloCustom.COLOR_C985FF,
            "&:hover": {
              color: "white",
              bgcolor: (theme) => theme.trelloCustom.COLOR_8C25DE,
            },
          }}
        >
          Save
        </Box>

        <Box
          onClick={() => toggleOpenDescriptionFieldCard()}
          sx={{
            cursor: "pointer",
            px: 1.75,
            py: 0.75,
            fontSize: ".9rem",
            fontWeight: "bold",
            borderRadius: "5px",
            color: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_D7D7D7
                : theme.trelloCustom.COLOR_313131,
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.trelloCustom.COLOR_281E38
                : theme.trelloCustom.COLOR_E6E6E6,
            "&:hover": {
              bgcolor: (theme) =>
                theme.palette.mode === "dark"
                  ? theme.trelloCustom.COLOR_463666
                  : theme.trelloCustom.COLOR_D7D7D7,
            },
          }}
        >
          Cancel
        </Box>
      </Box>
    </Box>
  );
};

export default RichTextEditor;
