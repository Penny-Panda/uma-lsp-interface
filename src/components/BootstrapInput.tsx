import { InputBase } from '@mui/material'
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
      '&:focus': {
        boxShadow: `${alpha(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
        borderColor: theme.palette.primary.main,
      },
    },
}));

export default BootstrapInput;