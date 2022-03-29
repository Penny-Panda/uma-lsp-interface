import { OptionsObject, useSnackbar } from "notistack";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";

import { AppContext } from "../../contexts/AppContext";
import copy from "../../helpers/copy";
import launchLSP from "../../helpers/launchLSP";
import { FormField } from "../../helpers/models";
import BaseInput from "../BaseInput";
import BaseSnackbar from "../BaseSnackbar";
import { LaunchFormOptions } from "./";
import { camelToSentenceCase } from "../../helpers/utils";
import BootstrapInput from "../BootstrapInput";
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { useMediaQuery, useTheme } from "@mui/material";

export type FPLFormOptions = {
  basePercentage: string;
  lowerBound: string;
  upperBound: string;
  gasPrice: string;
  customAncillaryData: string;
  // Mandatory
  Metric: string;
  Endpoint: string;
  Method: string;
  Key: string;
  Interval: string;
  // Optional
  Fallback: string;
  Aggregation: string;
  Rounding: string;
  Scaling: string;
  Unresolved: string;
  Custom: string;
};

const fplFields: Array<FormField<FPLFormOptions>> = [
  {
    name: "basePercentage",
    description: "Percentage of collateral per pair used as the floor.",
    type: "number",
    rules: {
      required: true,
      min: 0,
    },
  },
  {
    name: "lowerBound",
    description:
      "Below the lower bound each range token is worth the number of collateral that is set using collateral per pair.",
    type: "number",
    rules: {
      required: true,
      min: 0,
    },
  },
  {
    name: "upperBound",
    description:
      "Above the upper bound, holders of the long token are entitled to a fixed, minimum number of collateral.",
    type: "number",
    rules: {
      required: true,
      min: 0,
    },
  },
];

const requiredCustomAncillaryDataFields: Array<FormField<FPLFormOptions>> = [
  {
    name: "Metric",
    description:
      "Short description reflecting the metric and units to be measured.",
    rules: {
      required: true,
    },
  },
  {
    name: "Endpoint",
    description:
      "Link to data endpoint that should return the Metric at request timestamp.",
    rules: {
      required: true,
    },
  },
  {
    name: "Method",
    description:
      "Link to a descriptive source covering the objective and methodology for calculating a particular metric.",
    rules: {
      required: true,
    },
  },
  {
    name: "Key",
    description:
      "Which key value from the Endpoint response should be used by voters for further processing of the price request.",
    rules: {
      required: true,
    },
  },
  {
    name: "Interval",
    description:
      "This describes how request timestamps for pricing queries should be rounded and what is the granularity of historical data update frequency.",
    rules: {
      required: true,
    },
  },
];

const optionalCustomAncillaryDataFields: Array<FormField<FPLFormOptions>> = [
  {
    name: "customAncillaryData",
    description:
      "Custom ancillary data to be passed along with the price request.",
    rules: {
      required: false,
    },
  },
  {
    name: "Fallback",
    description:
      "In the event of the end-point not working or reporting false outcomes, a fallback ensures that UMA token holders can arrive at the proper result.",
    rules: {},
  },
  {
    name: "Aggregation",
    description:
      "In case any time series data processing is required this describes processing method used (e.g. calculating TWAP, finding peak value, etc.) and also sets the start timestamp for such aggregation.",
    rules: {},
  },
  {
    name: "Rounding",
    description:
      "This is integer number defining how many digits should be left to the right of decimal delimiter after rounding.",
    rules: {},
  },
  {
    name: "Scaling",
    description:
      "This is integer number defining power of 10 scaling to be applied after rounding.",
    rules: {},
  },
  {
    name: "Unresolved",
    description:
      "This is numeric value that voters should return for unresolvable price request (defaults to zero if omitted).",
    rules: {},
  },
  {
    name: "Custom",
    description:
      "Extra Custom Data that the user may wish to add onto the request.",
    rules: {},
  },
];

const gasPriceField: FormField<FPLFormOptions> = {
  name: "gasPrice",
  description: "Gas price to use in GWEI.",
  type: "number",
  rules: {
    required: true,
    min: 1,
    max: 1000,
  },
};

interface IFPLForm {
  formOptions: LaunchFormOptions;
  saveFormOptions: (options: Partial<LaunchFormOptions>) => LaunchFormOptions;
  handleBack: () => void;
}

const FPLForm: React.FC<IFPLForm> = ({
  formOptions,
  saveFormOptions,
  handleBack,
}) => {
  const { fpl } = formOptions;
  const isKPIOption = fpl.startsWith("KPI Option");
  const { enqueueSnackbar } = useSnackbar();
  const { web3, handleLoading } = React.useContext(AppContext);
  const { control, handleSubmit, getValues } = useForm<FPLFormOptions>({
    defaultValues: {
      ...(formOptions as unknown as FPLFormOptions),
      ...(formOptions.customAncillaryData?.length
        ? JSON.parse(formOptions.customAncillaryData)
        : ({} as any)),
    },
  });
  const theme = useTheme();
  const showText = useMediaQuery(theme.breakpoints.down('sm'));
  const [customList, setCustomList] = React.useState([
    { label: "", value: "" },
  ]);

  const prepareFormOptions = ({
    Metric,
    Endpoint,
    Method,
    Key,
    Interval,
    Fallback,
    Aggregation,
    Scaling,
    Unresolved,
    ...data
  }: FPLFormOptions): Partial<LaunchFormOptions> => {
    
    let customData: {[key: string]: string} = {};
    customList.forEach((item) => {
      customData[item.label] = item.value;
    });
    
    console.log("Custom DATA: ", customData);
    return ({
    ...data,
    customAncillaryData: JSON.stringify({
      Metric,
      Endpoint,
      Method,
      Key,
      Interval,
      Fallback,
      Aggregation,
      Scaling,
      Unresolved,
      ...customData,
    }),
  })};

  const onBackClick = () => {
    saveFormOptions(prepareFormOptions(getValues()));
    handleBack();
  };

  const onCopyClick = () => {
    const launchOptions = saveFormOptions(prepareFormOptions(getValues()));

    const url = new URL(`${window.location.href}`);

    Object.entries(launchOptions).forEach(([key, value]) => {
      if (!value) return;

      url.searchParams.set(
        key,
        key === "expirationTimestamp"
          ? ((value as Date).getTime() / 1000).toString()
          : value.toString(),
      );
    });

    copy(url.toString());
  };

  const onSubmit: SubmitHandler<FPLFormOptions> = async (data, event) => {
    const submitEvent = (
      (event?.nativeEvent as SubmitEvent).submitter?.attributes as NamedNodeMap
    ).getNamedItem("value")?.value;

    const simulate = submitEvent === "simulate";

    const launchOptions = saveFormOptions(prepareFormOptions(data));
    console.log("Launch Options: ", launchOptions);

    if (!web3) return;

    const snackbarOptions: Partial<OptionsObject> = {
      anchorOrigin: { horizontal: "right", vertical: "top" },
      autoHideDuration: 60000,
      persist: true,
      preventDuplicate: true,
    };

    try {
      handleLoading(true);

      const address = await launchLSP({
        web3,
        simulate,
        ...launchOptions,
      });

      enqueueSnackbar("", {
        ...snackbarOptions,
        key: "launch-success",
        content: (
          <BaseSnackbar
            key="launch-success"
            message={`LSP address: ${address}`}
            variant="success"
          />
        ),
      });
    } catch (e) {
      console.log(e);

      const message = (e as any).message || (e as Error).toString();

      enqueueSnackbar("", {
        ...snackbarOptions,
        key: "launch-error",
        content: (
          <BaseSnackbar
            key="launch-error"
            message="An error has occured"
            details={message}
            variant="error"
          />
        ),
      });
    } finally {
      handleLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    idx: number,
  ) => {
    const name = e.target.name;
    const newValue = e.target.value;
    let newArr = [...customList];

    if (name === "label") {
      newArr[idx].label = newValue;
    } else {
      newArr[idx].value = newValue;
    }
    setCustomList(newArr);
  };

  const handleAdd = () => {
    setCustomList((oldList) => [...oldList, { label: "", value: "" }]);
  };

  const handleRemove = (idx: number) => {
    setCustomList((oldList) => {
      return oldList.filter((val, index) => {
        return index !== idx;
      });
    });
  };

  const renderField = (fplField: FormField<FPLFormOptions>) => {
    if (fplField.name === "Custom") {
      const CustomComponent = (key: number) => (
        <Grid
          item
          key={key}
          container
          justifyContent="space-between"
          alignItems="center"
          xs={12}
          spacing={1}
          sx={{ pt: 2}}
        >
          <Grid item sm={5} xs={12}>
            <BootstrapInput
              name="label"
              fullWidth
              placeholder="Label"
              value={customList[key].label}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e, key)
              }
            />
          </Grid>
          <Grid item sm={5} xs={12}>
            <BootstrapInput
              name="value"
              fullWidth
              placeholder="Value"
              value={customList[key].value}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange(e, key)
              }
            />
          </Grid>
          <Grid item sm={1} xs={12}>
            {customList.length > 0 && (
              <Button variant="outlined" fullWidth onClick={() => handleRemove(key)}>
                {
                  !showText? <DeleteRoundedIcon />: "Remove"
                }
              </Button>
            )}
          </Grid>
        </Grid>
      );

      return (
        <Grid key={fplField.name} container sm={10} sx={{ py: 3 }}>
          <Grid item sm={10} sx={{ pt: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              {camelToSentenceCase(fplField.name.toString())}
            </Typography>
            <Typography variant="subtitle1">{fplField.description}</Typography>
          </Grid>

          {customList.map((prop, idx) => {
            return CustomComponent(idx);
          })}

          <Grid item xs={12} md={6} sx={{ pt: 3, display: 'flex', justifyContent: {xs: 'center', md: 'flex-start'}}}>
            {customList.length < 5 && (
              <Button variant="contained" onClick={handleAdd}>
                Add Property
              </Button>
            )}
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid key={fplField.name} container sm={10} sx={{ py: 3 }}>
        <Grid item sm={10} md={6} sx={{ pr: 8, pt: 2 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            {camelToSentenceCase(fplField.name.toString())}
          </Typography>
          <Typography variant="subtitle1">{fplField.description}</Typography>
        </Grid>
        <Grid item xs={12} md={5}>
          <Controller
            name={fplField.name as never}
            control={control}
            rules={fplField.rules}
            render={({ field, fieldState, formState }) => (
              <BaseInput
                disabled={formState.isSubmitting}
                customField={fplField}
                hookFormField={field as any}
                error={fieldState.error?.message || ""}
              />
            )}
          />
        </Grid>
      </Grid>
    );
  };

  return (
    <React.Fragment>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container justifyContent="center" spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <Typography variant="h6">FPL parameters</Typography>
          </Grid>
          {fplFields
            .filter((fplField) => {
              if (fplField.name === "upperBound") {
                return (
                  fpl === "RangeBond" ||
                  fpl === "Linear" ||
                  fpl === "KPI Option - Linear"
                );
              } else if (fplField.name === "basePercentage") {
                return fpl === "SuccessToken";
              }
              return true; // lowerBound
            })
            .map(renderField)}
          {isKPIOption && (
            <React.Fragment>
              <Grid item xs={12}>
                <Typography variant="h6">
                  Mandatory Ancillary Data Parameters
                </Typography>
              </Grid>
              {requiredCustomAncillaryDataFields.map(renderField)}
            </React.Fragment>
          )}
          <Grid item xs={12}>
            <Typography variant="h6">
              Optional Ancillary Data Parameters
            </Typography>
          </Grid>
          {optionalCustomAncillaryDataFields
            .filter((fplField) =>
              fplField.name === "customAncillaryData"
                ? !isKPIOption
                : isKPIOption,
            )
            .map(renderField)}
          <Grid item xs={12}>
            <Typography variant="h6">Gas Price</Typography>
          </Grid>
          {renderField(gasPriceField)}
          <Grid item xs={6} container sx={{ justifyContent: "flex-start" }}>
            <Button
              type="button"
              onClick={onBackClick}
              variant="contained"
              sx={{ mr: 2, mt: 2 }}
            >
              Back
            </Button>
            <Button type="button" onClick={onCopyClick} variant="contained" sx={{mt: 2}}>
              Copy link
            </Button>
          </Grid>
          <Grid item xs={6} container sx={{ justifyContent: "flex-end" }}>
            <Button type="submit" value="simulate" sx={{ mt: 2 }}>
              Simulate
            </Button>
            <Button type="submit" variant="contained" value="deploy" sx={{ml: 2, mt: 2}}>
              Deploy
            </Button>
          </Grid>
        </Grid>
      </form>
    </React.Fragment>
  );
};

export default FPLForm;
