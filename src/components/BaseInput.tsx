import React from "react";
import { ControllerRenderProps } from "react-hook-form";

import Box from "@mui/material/Box";
import { InputLabel } from "@mui/material";

import { FormField } from "../helpers/models";
import { camelToSentenceCase } from "../helpers/utils";

import BootstrapInput from './BootstrapInput';

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
