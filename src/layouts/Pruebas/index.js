import React, { useEffect, useRef, useState } from 'react'
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { FormControl, Grid, InputLabel, MenuItem, Select, OutlinedInput, TextField, Stack } from '@mui/material';
import MDBox from 'components/MDBox';


////////////////////////////////////////////////////////////////////////////////////

import moment from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Horas } from 'components/Elementos/Horas'

import { ProgresBar } from 'layouts/Jarabe/HistoricosJarabe/Elementos/ProgresBar';
import ReactECharts from "echarts-for-react";

export const Pruebas = ({ turno, ProduccionTurnos = {
  produccion: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  RechazosT1: 0,
  RechazosT2: 0,
  IndiceLlenadoT1: 0,
  IndiceLlenadoT2: 0,
  RendimientoT1: 0,
  RendimientoT2: 0
}/* , datosVelocidad = { turno1_Danger1: '00:00', turno1_Success1: '00:00', turno1_Warning1: '00:00', turno2_Danger2: '00:00', turno2_Success2: '00:00', turno2_Warning2: '00:00', turno2_outLine: '00:00', turno1_outLine: '00:00' } */ }) => {

  const ws = useRef(null);
  const wsUrl = process.env.REACT_APP_AUTH_URL_WEBSOCKET;//192.168.100.13

  const [fecha, setFecha] = useState(Date.now());
  const [urlTanques, setUrlTanques] = useState(`http://${wsUrl}:1880/gettanques/${moment(fecha).format("YYYY-MM-DD")}`);
  const [area, setArea] = useState('js1');

  const initialData = {
    RPM: 0,
    Nivel: 0,
    Producto: "COCA COLA EINSTEIN ALBLEND",
    TemperaturaSala: 25,
    Fecha: '09/01/2023',
    Datos: []
  }

  const [arreglo, setArreglo] = useState(initialData);

  const total = async () => {

    try {
      const response = await fetch(`${urlTanques}/${area}`);
      setArreglo(await response.json());
    } catch (error) {
      console.log('Hay un error: ' + error);
    }
  }

  useEffect(total, [urlTanques + area]);//el que esta dentro es una funcion, no es la variable

  useEffect(() => {
    setUrlTanques(`http://${wsUrl}:1880/gettanques/${moment(fecha).format("YYYY-MM-DD")}`);
    setArea(area)
  }, [fecha])

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //   -->Graficas 
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const colors = ['#0b00a9', '#a90000', ' #a90fff', '#1ace44'];
  const option = {
    color: colors,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '8%',
      width: '90%',

      containLabel: true

    },
    // toolbox: {
    //   feature: {
    //     dataView: { show: true, readOnly: false },
    //     restore: { show: true },
    //     saveAsImage: { show: true }
    //   }
    // },
    legend: {
      data: ['Nivel Tanque', 'Temperatura']
    },
    xAxis: [
      {
        type: 'category',
        axisTick: {
          alignWithLabel: true
        },
        // prettier-ignore
        data: arreglo.map(({ Fecha }) => (Fecha.substr(11, 5))),
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Nivel tanque',
        position: 'left',
        alignTicks: true,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[0]
          }
        },
        // axisLabel: {
        //   formatter:  '{value} PPM'
        // }
      },
      {
        type: 'value',
        name: 'Temperatura',
        position: 'right',
        alignTicks: true,
        // offset: 80,
        axisLine: {
          show: true,
          lineStyle: {
            color: colors[1]
          }
        },
        // axisLabel: {
        //   formatter:  '{value} PPM'
        // }
      }
    ],
    series: [
      {
        name: 'Nivel Tanque',
        data: arreglo.map(({ Nivel }) => (Nivel)),
        type: 'line',
      },
      {
        name: 'Temperatura',
        data: arreglo.map(({ TemperaturaSala }) => (TemperaturaSala)),
        yAxisIndex: 1,
        type: 'line',
      }
    ]
  };

  // Grafica
  const option2 = {
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['RPM']
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '8%',
      width: '90%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: arreglo.map(({ Fecha }) => (Fecha.substr(11, 5))), //Horas
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
    },
    series: [
      {
        name: 'RPM',
        data: arreglo.map(({ RPM }) => (RPM)),
        type: 'line',
      },

    ]
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //   -->
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  const handleChangeGraf = (event) => {
    setArea(event.target.value);
  }

  const handleChangeDate = (event) => {
    setFecha(moment(event).toDate());
  }

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //   -->Pruebas 
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // console.log(area)
  // console.log(urlTanques)
  console.log('llego aqui')
  console.log(arreglo)
  console.log(`${urlTanques}/${area}`)
  // console.log(urlTanques)
  // console.log(area)
  console.log(fecha)
  let lista = arreglo.map(({ Producto }) => (Producto))
  let prod = lista[lista.length -1]
  console.log(prod)

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  return (
    <>
      <Box /* sx={{ flexGrow: 1 }} */  >
        <Grid
          container
          spacing={{ xs: 2, md: 2 }}
        >
          <Grid item xs={12} md={12} lg={12}>
            <Card >
              <Grid ml={2} mr={2} >
                <Typography align='center' mt='2%' variant='h2' >Historicos</Typography>
                <Box display="flex" justifyContent="space-between" ml='5%' >
                  <Stack direction="row" spacing={1}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es} >
                      <DatePicker
                        label="Fecha"
                        value={moment(fecha).toDate()}
                        onChange={handleChangeDate}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </LocalizationProvider>
                    <FormControl sx={{ width: 250 }} size="small" >
                      <InputLabel id="demo-multiple-name-label">Area</InputLabel>
                      <Select
                        displayEmpty
                        //labelId="demo-multiple-name-label"
                        //id="demo-multiple-name"
                        value={area}
                        onChange={handleChangeGraf}
                        input={<OutlinedInput label="Area" />}
                        MenuProps={MenuProps}
                        style={{ height: 35 }}
                      //options https://react-select.com/home
                      >
                        <MenuItem
                          value="js1"
                        >
                          Jarabe simple 1
                        </MenuItem>
                        <MenuItem
                          value="js2"
                        >
                          Jarabe simple 2
                        </MenuItem>
                        <MenuItem
                          value="jt1"
                        >
                          Jarabe terminado 1
                        </MenuItem>
                        <MenuItem
                          value="jt2"
                        >
                          Jarabe terminado 2
                        </MenuItem>
                        <MenuItem
                          value="jt3"
                        >
                          Jarabe terminado 3
                        </MenuItem>
                        <MenuItem
                          value="jt4"
                        >
                          Jarabe terminado 4
                        </MenuItem>
                        <MenuItem
                          value="jt5"
                        >
                          Jarabe terminado 5
                        </MenuItem>
                        <MenuItem
                          value="jt6"
                        >
                          Jarabe terminado 6
                        </MenuItem>
                        <MenuItem
                          value="jt7"
                        >
                          Jarabe terminado 7
                        </MenuItem>
                        <MenuItem
                          value="jt8"
                        >
                          Jarabe terminado 8
                        </MenuItem>
                        {/*
                        <MenuItem
                          value="Jarabe terminado 9 "
                        >
                          Jarabe terminado 9
                        </MenuItem> */}
                        <MenuItem
                          value="jt10 "
                        >
                          Jarabe terminado 10
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <Typography align='center' variant='h5' color='#000' > {prod} </Typography> 
                  </Stack>
                </Box>
              </Grid>
              <Grid>
                <MDBox
                  variant="gradient"
                  borderRadius="lg"
                >
                  <ReactECharts option={option} style={{ height: '300px' }} />
                </MDBox>
              </Grid>
            </Card>
          </Grid>
          {/* Segunda seccion */}
          <Grid item xs={12} md={12} lg={12}>
            <Card >
              <Grid ml={'5%'} mr={2} mt={1} mb={0}>
                <Box /* ml={6} */>
                  <Grid md={11.5}  >
                    <ProgresBar turno={turno} />
                  </Grid>
                </Box>
              </Grid>
            </Card>
          </Grid>
          {/* Tercera seccion */}
          <Grid item xs={12} md={12} lg={12}>
            <MDBox mb={1.5}>
              <Card sx={{ height: "100%" }}>
                <MDBox justifyContent="space-between" pt={2} px={2}>
                  <ReactECharts option={option2} />
                </MDBox>
              </Card>
            </MDBox>
          </Grid>
        </Grid>
      </Box >

    </>
  )
}