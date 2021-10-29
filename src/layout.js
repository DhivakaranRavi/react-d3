import { Runtime, Inspector } from '@observablehq/runtime';
import React, { useEffect, useRef } from 'react';
import notebookHourly from './@d3/plot/hourly';
import notebookyearly from './@d3/plot/yearly';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export default function Layout() {

    const ref = useRef();
    const title = "Data Visualization";
    const description = " Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quosblanditiis tenetur unde suscipit, quam beatae rerum inventore consecteturneque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum quasi quidem quibusdam."

    const changeNoteBook = (notebook) =>{
        const runtime = new Runtime();
        runtime.module(notebook, (name) => {
            return new Inspector(ref.current);
        });
        return () => runtime.dispose();
    }

    useEffect(() => {
        changeNoteBook(notebookyearly)
    }, []);

    const [age, setAge] = React.useState('1');
    const [open, setOpen] = React.useState(false);
  
    const handleChange = (event) => {
      setAge(event.target.value);
      changeNoteBook(event.target.value === 1 ? notebookyearly : notebookHourly)
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleOpen = () => {
      setOpen(true);
    };
  
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display:'flex', justifyContent:"space-between"}}>
            <Box>
                <Typography variant="h2" component="div" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="body2" gutterBottom>
                    {description}
                </Typography>
                </Box>
      <FormControl sx={{ m: 1, minWidth: 220 }}>
        <InputLabel id="demo-controlled-open-select-label">Visualization</InputLabel>
        <Select
          labelId="demo-controlled-open-select-label"
          id="demo-controlled-open-select"
          open={open}
          onClose={handleClose}
          onOpen={handleOpen}
          value={age}
          label="Visualization"
          onChange={handleChange}
        >
          
          <MenuItem value={1}>Yearly Data</MenuItem>
          <MenuItem value={2}>Hourly Data</MenuItem>
        </Select>
      </FormControl>
            </Box>
            <Grid container spacing={2}  >
                <Grid item xs={12}>
                    <Item ref={ref} elevation={24}></Item>
                </Grid>
            </Grid>
        </Box>
    );
}