import React from "react";
import { ControllerRenderProps } from "react-hook-form";

import Box from "@mui/material/Box";
import { InputBase, InputLabel } from "@mui/material";

import { FormField } from "../helpers/models";
import { camelToSentenceCase } from "../helpers/utils";

import { alpha, styled } from '@mui/material/styles';


const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(1),
  },
  '& .MuiInputBase-input': {
    borderRadius: 4,
    position: 'relative',
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 12px',
    transition: theme.transitions.create([
      'border-color',
      'background-color',
      'box-shadow',
    ]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:focus': {
      boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
      borderColor: theme.palette.primary.main,
    },
  },
}));

interface IBaseInput {
  disabled: boolean;
  customField: FormField<any>;
  hookFormField: ControllerRenderProps;
  error: string;
  fullWidth?: boolean;
}

const BaseInput: React.FC<IBaseInput> = ({
  disabled,
  customField,
  hookFormField,
  error,
  fullWidth = true,
}) => {
  return (
    <React.Fragment>
      <Box display="flex" flexDirection='column' alignItems="flex-start">
        <InputLabel sx={{ mt: { md: 0, lg: 2}, display: ['none', 'none', 'block'] }} htmlFor="bootstrap-input">
          {camelToSentenceCase(customField.name.toString())}
        </InputLabel>
        <BootstrapInput
          id={`${customField.name.toString()}-input-label`}
          disabled={disabled}
          required={Boolean(customField.rules.required)}
          type={customField.type || "string"}
          fullWidth={fullWidth}
          error={Boolean(error)}
          inputProps={
            customField.type === "number"
              ? {
                  max: customField.rules.max?.toString(),
                  min: customField.rules.min?.toString(),
                  step: "any",
                }
              : {}
          }
          {...hookFormField}
        />
      </Box>
    </React.Fragment>
  );
};

export default BaseInput;
