import { FormControl, Grid, IconButton, InputLabel, Menu, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import MDBox from 'components/MDBox'
import ComplexStatisticsCard from 'examples/Cards/StatisticsCards/ComplexStatisticsCard'
import React, { useEffect, useMemo, useState } from 'react'
import Card from "@mui/material/Card";
import ReplayIcon from '@mui/icons-material/Replay';
import Stack from "@mui/material/Stack";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2'
import MDTypography from 'components/MDTypography';
import DataTable from 'examples/Tables/DataTable';
import moment from 'moment';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { es } from 'date-fns/locale';
import { Scrollbars } from 'react-custom-scrollbars';
import { SavePDF } from 'assets/PDF/SavePDF';
import { SavePDFTableAguaConsumoDirario, SavePDFTableAguaConsumoArea } from 'assets/PDF/SavePDF';
import { SaveExcel } from 'assets/EXCEL/SaveExcel';
import ReactTooltip from 'react-tooltip'

moment.locale("es-mx");

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

function AguaScreem() {

  const [consumoHistoricosAguaGrafica, setConsumoHistoricosAguaGrafica] = useState([]);

  const [consumoHistoricosAguaGrafica2, setConsumoHistoricosAguaGrafica2] = useState([]);



  const state = {
    labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
    datasets: [
      {
        label: ' m³ ',
        backgroundColor: 'rgba(75,192,192,0.8)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: consumoHistoricosAguaGrafica.map(value => value.valor)
      }
    ]
  }
  // Segunda grafica
  const state2 = {
    labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'],
    datasets: [
      {
        label: ' m³ ',
        backgroundColor: 'rgba(75,192,192,0.8)',
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: consumoHistoricosAguaGrafica2.map(value => value.valor)
      }
    ]
  }

  const apiUrl = process.env.REACT_APP_API_URL;//http://192.168.100.13/5001/api
  const wsUrl = process.env.REACT_APP_AUTH_URL_WEBSOCKET;//192.168.100.13


  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );


  const options = {
    plugins: {
      title: {
        align: 'center',
        display: true,
        text: 'Grafica de entrada consumo por hora (m³)',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
      },
    },
  };

  const optionsReporte = {
    plugins: {
      title: {
        align: 'center',
        display: true,
        text: 'Grafica Reporte consumo por hora (m³)',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        stacked: false,
      },
    },
  };

  let initialState = {
    Taxte: 0,
    Japama: 0,
    L1: 0,
    L2: 0,
    L3: 0,
    L5: 0,
  };

  let initialState2 = [];
  let initialState3 = {
    taxtes: [350.75, 0, 0, 0, 0, 63.75, 155.75, 304.5, 278.75, 231.25, 334, 90.75, 234.75, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Japama: [0, 0.03, 0, 0, 0.03, 0, 0, 0, 0.03, 0, 0.03, 0, 0.03, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Total: [350.75, 0.03, 0, 0, 0.03, 63.75, 155.75, 304.5, 278.78, 231.25, 334.03, 90.75, 234.78, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  }

  let datos = [];
  let datos2 = [];
  let datos3 = [];
  let datos6 = [];
  let datos7 = [];
  let AreaListResult = [
    { area: "--- TODAS ---" }
  ]
  const [fechaInicio, setFechaInicio] = useState(moment(Date.now()));
  const [fechaFin, setFechaFin] = useState(moment(Date.now()));
  const [areasName, setAreasName] = useState([]);
  //const [areasName, setAreasName] = useState("--- TODAS ---");
  const [areasReporte, setAreasReporte] = useState([]);
  const [areasList, setAreasList] = useState([]);
  const [fecha, setFecha] = useState(moment(Date.now()));
  const [fechaGrafica, setFechaGrafica] = useState(moment(Date.now())/*.subtract(1, "days")*/)
  const [Data2, setData2] = useState(initialState3);
  const [Data, setData] = useState(initialState);
  //const [Data2, setData2] = useState(initialState2);
  const [Data3, setData3] = useState(initialState2);
  const [Data4, setData4] = useState(initialState2);
  const [showRefresh, setShowRefresh] = useState(true);
  const showRefreshDiario = moment(fechaFin).format("YYYY-MM-DD") === moment(Date.now()).format("YYYY-MM-DD") ? true : false


  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    //console.log(event)
    //alert(event);  
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const [anchorEl2, setAnchorEl2] = useState(null);
  const open2 = Boolean(anchorEl2);
  const handleClick2 = (event) => {
    //console.log(event)
    //alert(event);  
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };


  const handleGetGatewayData = () => alert("buscar");

  const ConsumoAguaActual = async () => {
    const urlConsumoActual = `http://${wsUrl}:1880/api/ConsumoAguaActual`;
    //console.log(url);
    try {
      const response = await fetch(urlConsumoActual);
      datos = await response.json();

      //fill();
      //enableRefresh();
      setData(datos);
      //console.log(DatosActual);
      //disableNoData();

    } catch (error) {
      console.log('Hay un error: ' + error);
    }
  }


  const AreasLista = async () => {
    const urlAreasList = `${apiUrl}/agua/areas`;
    //console.log(url);
    try {
      const responseAreas = await fetch(urlAreasList);
      AreaListResult = await responseAreas.json();
      //AreaListResult.map(item => console.log(item.area));
      //console.log(AreaListResult);

      //fill();
      //enableRefresh();


      setAreasList(AreaListResult);
      //console.log(DatosActual);
      console.log(areasList);
      //disableNoData();

    } catch (error) {
      console.log('Hay un error: ' + error);
    }
  }
  useEffect(AreasLista, [])


  const ReporteConsumoAguaHora = async () => {
    const urlReporteConsumoAguaHoras = `http://${wsUrl}:1880/api/ReporteConsumoAguaHoras`;
    //alert("useEfect");
    //console.log(url);
    try {
      const response2 = await fetch(urlReporteConsumoAguaHoras);
      datos2 = await response2.json();

      //fill();
      //enableRefresh();

      if (datos2 != Data2) {
        console.log(urlReporteConsumoAguaHoras)
        console.log(Data2)
        setData2(datos2);
      }
      //console.log(DatosActual);
      //disableNoData();

    } catch (error) {
      console.log('Hay un error: ' + error);
    }
  }


  const urlConsumoAguaporArea = `http://${wsUrl}:1880/api/ConsumoAguaporArea`;
  const ReporteConsumoAguaporArea = () => fetch(urlConsumoAguaporArea)
    .then(res => res.json())
    .catch(error => console.error('Error:', error))
    .then(response => setData4(response));
  console.log();


  /*
    const ReporteConsumoAguaporArea = async () => {
      const urlConsumoAguaporArea = `http://${baseUrl}:1880/api/ConsumoAguaporArea`;
      //alert("useEfect");
      //console.log(url);
      try {
          const response5 = await fetch(urlConsumoAguaporArea);
          datos6 = await response5.json();
          
          //fill();
          //enableRefresh();
        if(datos6 != Data4)
        {
          setData4(datos6);
        }
            //console.log(DatosActual);
              //disableNoData();
          
      } catch (error) {
          console.log('Hay un error: ' + error);
      }
    }*/
  //const segundo = new Date().getSeconds();
  const minuto = new Date().getMinutes();

  //setTimeout(ConsumoAguaActual, 10000);
  useEffect(ConsumoAguaActual, [minuto]);

  useEffect(ReporteConsumoAguaHora, [minuto]);
  //setTimeout(ReporteConsumoAguaHora, 10000);

  useEffect(ReporteConsumoAguaporArea, [minuto]);
  //setTimeout(ReporteConsumoAguaporArea, 10000);

  //useEffect(ReporteConsumoAguaHora, [minuto])
  //useEffect(ReporteConsumoAguaporArea, [minuto])



  //const memoizedValue = useMemo(() => ReporteConsumoAguaHora, [ReporteConsumoAguaHora]);

  //setTimeout(ReporteConsumoAguaHora, 3000);


  /*
    const ConsumoTotalizado = async () => {
      const url3 = `${baseUrlApi}/agua/getTotalizadoAgua?Fecha=${moment(fecha).format("YYYY-MM-DD")}`;
      //https://localhost:5001/api/agua/getTotalizadoAgua?Fecha=2022-06-14
      //console.log(url);
      try {
          const response3 = await fetch(url3);
          datos3 = await response3.json();datos
          
          //fill();
          //enableRefresh();
          setData1(datos3);
            //console.log(DatosActual);
              //disableNoData();
          
      } catch (error) {
          console.log('Hay un error: ' + error);
      }
    }*/
  const url3 = `${apiUrl}/agua/getTotalizadoAgua?Fecha=${moment(fecha).format("YYYY-MM-DD")}`;
  //agua/getReporteAgua/2022-05-01/2022-06-17/Taxtes
  const url4 = `${apiUrl}/agua/getReporteAgua/${moment(fechaInicio).format("YYYY-MM-DD")}/${moment(fechaFin).format("YYYY-MM-DD")}/${areasName.join(' ')}`;

  const url5 = `http://${wsUrl}:1880/api/consumoTotalizadoActual`;

  const url6 = `${apiUrl}/agua/getGraficoConsumoAguaHora/${moment(fechaGrafica).format("YYYY-MM-DD")}/${moment(fechaGrafica).format("YYYY-MM-DD")}/${areasReporte.join(' ')}`;

  const url7 = `${apiUrl}/agua/getGraficoConsumoAguaHora/${moment(fechaGrafica).format("YYYY-MM-DD")}/${moment(fechaGrafica).format("YYYY-MM-DD")}/${areasReporte}`;

  const GraficaReportAguaConsumo = async () => {
    try {
      const response7 = await fetch(url6);
      datos3 = await response7.json();
      setConsumoHistoricosAguaGrafica(datos3);
      //console.log(datos3);
    } catch (error) {
      console.log('Hay un error: ' + error);
    }
  }

  useEffect(GraficaReportAguaConsumo, [url6]);

  const GraficaReportAguaConsumo2 = async () => {
    try {
      const response7 = await fetch(url7);
      datos7 = await response7.json();
      setConsumoHistoricosAguaGrafica2(datos7);
      //console.log(datos7);
    } catch (error) {
      console.log('Hay un error: ' + error);
    }
  }

  useEffect(GraficaReportAguaConsumo2, [url7]);


  const datosActuales = async () => {
    try {
      const response5 = await fetch(url5);
      datos6 = await response5.json();
      setData1(datos6);
    } catch (error) {
      console.log('Hay un error: ' + error);
    }
  }

  const getDatosConsumoAgua = async () => {


    //const url3 = `${baseUrlApi}/agua/getTotalizadoAgua?Fecha=${moment(fecha).format("YYYY-MM-DD")}`;
    //https://localhost:5001/api/agua/getTotalizadoAgua?Fecha=2022-06-14
    //console.log(url);
    setShowRefresh(false)
    try {
      const response3 = await fetch(url3);
      datos3 = await response3.json();

      //fill();
      //enableRefresh();
      setData1(datos3);
      //console.log(Data1);
      //console.log(DatosActual);
      //disableNoData();

    } catch (error) {
      console.log('Hay un error: ' + error);
    }
  }

  useEffect(moment(fecha).format("YYYY-MM-DD") === moment(Date.now()).format("YYYY-MM-DD") ? datosActuales : getDatosConsumoAgua, [url3])


  const consumoAguaDario = async () => {
    //const url3 = `${baseUrlApi}/agua/getTotalizadoAgua?Fecha=${moment(fecha).format("YYYY-MM-DD")}`;
    //https://localhost:5001/api/agua/getTotalizadoAgua?Fecha=2022-06-14
    //console.log(url);
    try {
      const response3 = await fetch(url4, {
        'mode': 'cors',
        'headers': {
          'Access-Control-Allow-Origin': '*',
        }
      });
      datos3 = await response3.json();

      //fill();
      //alert(url4)
      //enableRefresh();
      setData3(datos3);
      //console.log(DatosActual);
      //disableNoData();

    } catch (error) {
      console.log('Hay un error: ' + error);
    }
  }

  useEffect(consumoAguaDario, [url4 + areasName.join('/')])




  const labels = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];



  const Area = /*Data4[2];//*/[
    "TAXTES",
    "JAPAMA",
    "Jarabes Linea 2",
    "Prep Bebida L1",
    "Lavadora Linea 1",
    "Rechazo Osmosis",
    "Calderas",
    "Prep Bebida L2",
    "Condensadores",
    "Lavadora Linea 3",
    "Suavizada",
    "CIP",
    "Recuperada",
    "Alblend",
    "Enjuagador Linea 2",
    "Permeada",
    "Prep Bebida L3",
    "Jarabes",
    "Lavadora Linea 5",
    "Torre Contacto Linea 5"
  ];
  const datos4 = {
    labels,
    datasets: [
      {
        label: "Taxtes (m³)",
        data: Data2.taxtes,
        backgroundColor: "rgb(255, 99, 132)"
      },
      {
        label: "Japama (m³)",
        data: Data2.Japama,
        backgroundColor: "rgb(75, 192, 192)"
      },
      {
        label: "Total (m³)",
        data: Data2.Total,
        backgroundColor: "rgb(53, 162, 235)"
      }
    ]
  };
  //19,6,8,13,9,16,2,14,4,10,18,3,17,1,5,12,15,7,11,20
  const datos5 = {
    labels: Area,
    datasets: [{
      label: " Entradas ( m³ )",
      data: Data4.slice(0, 2), // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
      backgroundColor: 'rgba(0, 128, 0, 0.2)', // Color de fondo
      borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
      borderWidth: 1,// Ancho del borde
    },
    {
      label: "Salidas ( m³ )",
      data: [0, 0].concat(Data4.slice(2, 18)), // La data es un arreglo que debe tener la misma cantidad de valores que la cantidad de etiquetas
      backgroundColor: 'rgba(54, 162, 235, 0.2)', // Color de fondo
      borderColor: 'rgba(54, 162, 235, 1)', // Color del borde
      borderWidth: 1,// Ancho del borde
    }]
  };

  const optionsporArea = {
    plugins: {
      title: {
        align: 'center',
        display: true,
        text: 'Consumo de agua general  (m³)',
      },
    },
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
    },
  };

  let initialState1 = [];

  const [Data1, setData1] = useState(initialState1);

  const handleChange = (event) => {
    setAreasName(event.target.value);
  };

  const handleChangeGraf = (event) => {
    setAreasReporte(event.target.value);
    //alert(fechaGrafica);
    //alert(areasReporte);
  };

  const handleSearch = () => {
    alert("Search");
  }

  const dataTableData = {
    columns: [
      //{ Header: "Fecha", accessor: "fecha" },
      { Header: "Área", accessor: "area" },
      { Header: "Consumo Totalizado (m³)", accessor: "consumoTotal" },
    ],
    rows: Data1,
  };
  const dataTableData2 = {
    columns: [
      //{ Header: "Fecha", accessor: "fecha" },
      //{ Header: "Dia", accessor: "diaSemana" },
      { Header: "Área", accessor: "area" },
      { Header: "Consumo Totalizado (m³)", accessor: "flujo" },
    ],
    rows: Data3,
  };

  const ReporteConsumoDiario = (dataTableData) => {
    //alert(event);

    console.log("inicializando la impresion del archivo");
    SavePDFTableAguaConsumoDirario(
      dataTableData
      , `REPORTE DE CONSUMO DE AGUA POR DIA ${moment(Date.now()).format("DD/MM/YYYY")}`
      , moment(fechaInicio).format("DD/MM/YYYY")
      , moment(fechaFin).format("DD/MM/YYYY"));
    console.log("tarea finalizada");
  }

  const ReporteConsumoArea = (dataTableData) => {
    //alert(event);
    console.log("inicializando la impresion del archivo");
    SavePDFTableAguaConsumoArea(
      dataTableData
      , `REPORTE DE CONSUMO DE AGUA POR ÁREA ${moment(Date.now()).format("DD-MM-YYYY")}`
    );
    console.log("tarea finalizada");
    setAnchorEl(null);
  }

  const handleExcelExportTtotalizado = (dataTableData) => {
    let heading = [
      [
        "Área",
        "Consumo Totalizado en Metros Cúbicos",
      ],
    ];
    let headers = [
      "area",
      "consumoTotal",
    ];
    SaveExcel(
      heading,
      headers,
      dataTableData,
      `REPORTE DE CONSUMO DE AGUA Totalizado ${moment(Date.now()).format("DD-MM-YYYY")}`
    );
    setAnchorEl(null);
  };

  const handleExcelExporDiario = (dataTableData) => {

    //console.log(dataTableData.map({dataTableData.area, dataTableData.consumoTotal}))
    let heading = [
      [
        "Fecha",
        "Área",
        "Consumo Diario en Metros Cúbicos",
      ],
    ];
    let headers = [
      `${moment(fechaInicio).format("YYYY-MM-DD")}-${moment(fechaFin).format("YYYY-MM-DD")}`,
      "area",
      "consumoTotal",
    ];
    SaveExcel(
      heading,
      headers,
      dataTableData,
      `REPORTE DE CONSUMO DE AGUA Diario ${moment(Date.now()).format("DD-MM-YYYY")}`
    );
    setAnchorEl2(null);
  };


  const refrescarTablaTotalizado = () => {
    datosActuales();
    //setShowRefresh(true);
  }


  const refrescarTablaDiario = () => {
    consumoAguaDario();
    //setShowRefresh(true);
  }


  return (
    <>
      {/*<MDTypography variant="h3">Agua</MDTypography>*/}
      <MDBox mt={1.5}>
        <Grid container spacing={3}>
          <Grid item xs={6} md={6} lg={2}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="opacity"
                title="Taxtes"
                count={Data.Taxte + " m³"}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={6} md={6} lg={2}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="opacity"
                title="Japama"
                count={Data.Japama + " m³"}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={6} md={6} lg={2}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                //color="dark"
                icon="opacity"
                title="L1"
                count={Data.L1 + " m³"}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={6} md={6} lg={2}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="opacity"
                title="L2"
                count={Data.L2 + " m³"}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={6} md={6} lg={2}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="opacity"
                title="L3"
                count={Data.L3 + " m³"}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={6} md={6} lg={2}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="opacity"
                title="L5"
                count={Data.L5 + " m³"}
                percentage={{
                  color: "success",
                  amount: "",
                  label: "",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            {/* Grafica de entrada consumo por hora(m3) */}
            <MDBox mb={1.5} >
              <Card sx={{ height: "100%" }} >
                <Bar options={options} data={datos4} />
              </Card>
            </MDBox>
            {/* Grafica de agua general */}
            <MDBox mb={1.5} >
              <Card sx={{ height: "100%" }}>
                <Bar options={optionsporArea} data={datos5} />
              </Card>
            </MDBox>
            {/* Reporte consumo agua) */}
            <MDBox mb={1.5}>
              <Card sx={{ height: "100%" }}>
                <MDBox display="flex" justifyContent="space-between" pt={2} px={2}>
                  <Stack direction="row" spacing={1}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                      <DatePicker
                        label="Fecha"
                        value={fechaGrafica}
                        onChange={(newValue) => {
                          setFechaGrafica(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </LocalizationProvider>
                    <FormControl sx={{ width: 250 }} size="small" >
                      <InputLabel id="demo-multiple-name-label">Area</InputLabel>
                      <Select
                        multiple
                        displayEmpty
                        //labelId="demo-multiple-name-label"
                        //id="demo-multiple-name"
                        value={areasReporte}
                        onChange={handleChangeGraf}
                        input={<OutlinedInput label="Area" />}
                        renderValue={(selected) => {
                          /*  if (selected.length === 0) {
                              
                              return <em>--- TODAS ---</em>;
                            }*/
                          //alert('Areas: ' + areasName)
                          return selected.join('/');
                        }}
                        MenuProps={MenuProps}
                        style={{ height: 35 }}
                      //options https://react-select.com/home
                      >
                        <MenuItem
                          value="Alblend"
                        >
                          Alblend
                        </MenuItem>
                        <MenuItem
                          value="Atlantium"
                        >
                          Atlantium
                        </MenuItem>
                        <MenuItem
                          value="Calderas"
                        >
                          Calderas
                        </MenuItem>
                        <MenuItem
                          value="CIP"
                        >
                          CIP
                        </MenuItem>
                        <MenuItem
                          value="Condensadores"
                        >
                          Condensadores
                        </MenuItem>
                        <MenuItem
                          value="Enjuagador Linea 2"
                        >
                          Enjuagador Linea 2
                        </MenuItem>
                        <MenuItem
                          value="JAPAMA"
                        >
                          JAPAMA
                        </MenuItem>
                        <MenuItem
                          value="Jarabes"
                        >
                          Jarabes
                        </MenuItem>
                        <MenuItem
                          value="Jarabes Linea 2"
                        >
                          Jarabes Linea 2
                        </MenuItem>
                        <MenuItem
                          value="Lavadora Linea 1"
                        >
                          Lavadora Linea 1
                        </MenuItem>
                        <MenuItem
                          value="Lavadora Linea 3"
                        >
                          Lavadora Linea 3
                        </MenuItem>
                        <MenuItem
                          value="Lavadora Linea 5"
                        >
                          Lavadora Linea 5
                        </MenuItem>
                        <MenuItem
                          value="Microfiltrado"
                        >
                          Microfiltrado
                        </MenuItem>
                        <MenuItem
                          value="Permeada"
                        >
                          Permeada
                        </MenuItem>
                        <MenuItem
                          value="Prep Bebida L1"
                        >
                          Prep Bebida L1
                        </MenuItem>
                        <MenuItem
                          value="Prep Bebida L2"
                        >
                          Prep Bebida L2
                        </MenuItem>
                        <MenuItem
                          value="Prep Bebida L3"
                        >
                          Prep Bebida L3
                        </MenuItem>
                        <MenuItem
                          value="Rechazo Osmosis"
                        >
                          Rechazo Osmosis
                        </MenuItem>
                        <MenuItem
                          value="Recuperada"
                        >
                          Recuperada
                        </MenuItem>
                        <MenuItem
                          value="Suavizada"
                        >
                          Suavizada
                        </MenuItem>
                        <MenuItem
                          value="Tanque reactor"
                        >
                          Tanque reactor
                        </MenuItem>
                        <MenuItem
                          value="TAXTES"
                        >
                          TAXTES
                        </MenuItem>
                        <MenuItem
                          value="Torre Contacto Linea 2"
                        >
                          Torre Contacto Linea 2
                        </MenuItem>
                        <MenuItem
                          value="Torre Contacto Linea 5"
                        >
                          Torre Contacto Linea 5
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </MDBox>
                <Bar data={state}
                  options={
                    {
                      plugins: {
                        title: {
                          display: true,
                          text: 'Reporte consumo Agua',
                          //align: 'right',
                          fontSize: 20
                        },
                        legend: {
                          display: false,
                position: 'top'
                        }
                      }
                    }} />
              </Card>
            </MDBox>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} lg={6} >
            <MDTypography variant="h5">Reporte Totalizador de Sistema de Medidores</MDTypography>
            <MDBox mb={1.5}>
              <Card sx={{ height: "100%" }}>
                <MDBox display="flex" justifyContent="space-between" pt={2} px={2}>
                  <Stack direction="row" spacing={1}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                      <DatePicker
                        label="Fecha"
                        value={fecha}
                        onChange={(newValue) => {
                          setFecha(moment(newValue))
                          //alert(moment(newValue).format("YYYY-MM-DD") +'==='+ moment(Date.now()).format("YYYY-MM-DD"))
                          if (moment(newValue).format("YYYY-MM-DD") === moment(Date.now()).format("YYYY-MM-DD")) {
                            //alert('es igual')
                            setShowRefresh(true);
                          }
                          else {
                            //alert('no es igual')
                            setShowRefresh(false);
                          }
                        }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </LocalizationProvider>
                    <ReactTooltip
                      id='btnRefresh'
                      place='bottom'
                      //type='info'
                      effect='solid'
                      backgroundColor='#5596F9'
                    >
                      Actualizar datos
                    </ReactTooltip>
                    <IconButton
                      aria-label="delete"
                      data-tip data-for='btnRefresh'
                      onClick={() => refrescarTablaTotalizado()}
                      disabled={!showRefresh}
                      sx={{
                        opacity: showRefresh ? 1 : 0
                      }}
                    >
                      <ReplayIcon />
                    </IconButton>
                    <IconButton
                      aria-label="FileDownload"
                      data-tip data-for='btnDownload'
                      aria-controls="basic-menu"
                      aria-haspopup="true"
                      aria-expanded={open ? 'true' : undefined}
                      onClick={handleClick}
                    >
                      <FileDownloadIcon />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem onClick={() => handleExcelExportTtotalizado(dataTableData.rows)}>Excel (.xlsx)</MenuItem>
                      <MenuItem onClick={() => ReporteConsumoArea(dataTableData.rows)}>PDF (.pdf)</MenuItem>
                    </Menu>
                  </Stack>
                </MDBox>
                <Scrollbars style={{ width: '100%', height: 500 }}>
                  <DataTable table={dataTableData} />
                </Scrollbars>
              </Card>
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={6} >
            <MDBox mb={1.5}>
              <MDTypography alignItems="center" variant="h5">Reporte consumo por tiempo</MDTypography>
              <Card sx={{ height: "100%" }}>
                <MDBox display="flex" justifyContent="space-between" pt={2} px={2}>
                  <Stack direction="row" spacing={1}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                      <DatePicker
                        label="Fecha Inicio"
                        value={fechaInicio}
                        onChange={(newValue) => {
                          setFechaInicio(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                      <DatePicker
                        label="Fecha Fin"
                        value={fechaFin}
                        onChange={(newValue) => {
                          setFechaFin(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </LocalizationProvider>
                    <FormControl sx={{ width: 200 }} size="small" >
                      <InputLabel id="demo-multiple-name-label">Area</InputLabel>
                      <Select
                        multiple
                        displayEmpty
                        //labelId="demo-multiple-name-label"
                        //id="demo-multiple-name"
                        value={areasName}
                        onChange={handleChange}
                        input={<OutlinedInput label="Area" />}
                        renderValue={(selected) => {
                          /*  if (selected.length === 0) {
                              
                              return <em>--- TODAS ---</em>;
                            }*/
                          //alert('Areas: ' + areasName)
                          return selected.join('/');
                        }}
                        MenuProps={MenuProps}
                        style={{ height: 35 }}
                      //options https://react-select.com/home
                      >
                        {
                          //areasList.map((item, index) =>{
                          //  })
                        }
                        <MenuItem
                          value="Alblend"
                        >
                          Alblend
                        </MenuItem>
                        <MenuItem
                          value="Atlantium"
                        >
                          Atlantium
                        </MenuItem>
                        <MenuItem
                          value="Calderas"
                        >
                          Calderas
                        </MenuItem>
                        <MenuItem
                          value="CIP"
                        >
                          CIP
                        </MenuItem>
                        <MenuItem
                          value="Condensadores"
                        >
                          Condensadores
                        </MenuItem>
                        <MenuItem
                          value="Enjuagador Linea 2"
                        >
                          Enjuagador Linea 2
                        </MenuItem>
                        <MenuItem
                          value="JAPAMA"
                        >
                          JAPAMA
                        </MenuItem>
                        <MenuItem
                          value="Jarabes"
                        >
                          Jarabes
                        </MenuItem>
                        <MenuItem
                          value="Jarabes Linea 2"
                        >
                          Jarabes Linea 2
                        </MenuItem>
                        <MenuItem
                          value="Lavadora Linea 1"
                        >
                          Lavadora Linea 1
                        </MenuItem>
                        <MenuItem
                          value="Lavadora Linea 3"
                        >
                          Lavadora Linea 3
                        </MenuItem>
                        <MenuItem
                          value="Lavadora Linea 5"
                        >
                          Lavadora Linea 5
                        </MenuItem>
                        <MenuItem
                          value="Microfiltrado"
                        >
                          Microfiltrado
                        </MenuItem>
                        <MenuItem
                          value="Permeada"
                        >
                          Permeada
                        </MenuItem>
                        <MenuItem
                          value="Prep Bebida L1"
                        >
                          Prep Bebida L1
                        </MenuItem>
                        <MenuItem
                          value="Prep Bebida L2"
                        >
                          Prep Bebida L2
                        </MenuItem>
                        <MenuItem
                          value="Prep Bebida L3"
                        >
                          Prep Bebida L3
                        </MenuItem>
                        <MenuItem
                          value="Rechazo Osmosis"
                        >
                          Rechazo Osmosis
                        </MenuItem>
                        <MenuItem
                          value="Recuperada"
                        >
                          Recuperada
                        </MenuItem>
                        <MenuItem
                          value="Suavizada"
                        >
                          Suavizada
                        </MenuItem>
                        <MenuItem
                          value="Tanque reactor"
                        >
                          Tanque reactor
                        </MenuItem>
                        <MenuItem
                          value="TAXTES"
                        >
                          TAXTES
                        </MenuItem>
                        <MenuItem
                          value="Torre Contacto Linea 2"
                        >
                          Torre Contacto Linea 2
                        </MenuItem>
                        <MenuItem
                          value="Torre Contacto Linea 5"
                        >
                          Torre Contacto Linea 5
                        </MenuItem>
                      </Select>
                    </FormControl>
                    <IconButton
                      aria-label="delete"
                      data-tip data-for='btnRefresh'
                      onClick={() => refrescarTablaDiario()}
                      disabled={!showRefreshDiario}
                      sx={{
                        opacity: showRefreshDiario ? 1 : 0
                      }}
                    >
                      <ReplayIcon />
                    </IconButton>
                    <ReactTooltip
                      id='btnDownload'
                      place='bottom'
                      //type='info'
                      effect='solid'
                      backgroundColor='#5596F9'
                    >
                      Descargar reporte
                    </ReactTooltip>
                    <IconButton
                      aria-label="FileDownload"
                      data-tip data-for='btnDownload'
                      aria-controls="basic-menu"
                      aria-haspopup="true"
                      aria-expanded={open2 ? 'true' : undefined}
                      onClick={handleClick2}
                    >
                      <FileDownloadIcon />
                    </IconButton>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl2}
                      open={open2}
                      onClose={handleClose2}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem onClick={() => handleExcelExporDiario(dataTableData2.rows)}>Excel (.xlsx)</MenuItem>
                      <MenuItem onClick={() => ReporteConsumoDiario(dataTableData2.rows)}>PDF (.pdf)</MenuItem>
                    </Menu>
                  </Stack>
                </MDBox>
                <Scrollbars style={{ width: '100%', height: 500 }}>
                  <DataTable table={dataTableData2} />
                </Scrollbars>
              </Card>
            </MDBox>
          </Grid>
          {/* Grafica consumo por tiempo */}
          <Grid item xs={12} md={12} lg={12}>
            <MDBox mb={1.5}>
              <Card sx={{ height: "100%" }}>
                <MDBox display="flex" justifyContent="space-between" pt={2} px={2}>
                  <Stack direction="row" spacing={1}>
                    <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
                      <DatePicker
                        label="Fecha"
                        value={fechaGrafica}
                        onChange={(newValue) => {
                          setFechaGrafica(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} size="small" />}
                      />
                    </LocalizationProvider>
                    <FormControl sx={{ width: 250 }} size="small" >
                      <InputLabel id="demo-multiple-name-label">Area</InputLabel>
                      <Select
                        multiple
                        displayEmpty
                        value={areasReporte}
                        onChange={handleChangeGraf}
                        input={<OutlinedInput label="Area" />}
                        renderValue={(selected) => {
                          return selected.join('/');
                        }}
                        MenuProps={MenuProps}
                        style={{ height: 35 }}
                      //options https://react-select.com/home
                      >
                        {/* <Select
                        displayEmpty
                        //labelId="demo-multiple-name-label"
                        //id="demo-multiple-name"
                        value={areasReporte}
                        onChange={handleChangeGraf}
                        input={<OutlinedInput label="Area" />}
                        MenuProps={MenuProps}
                        style={{ height: 35 }}
                      //options https://react-select.com/home
                      > */}
                        <MenuItem
                          value="Alblend"
                        >
                          Alblend
                        </MenuItem>
                        <MenuItem
                          value="Atlantium"
                        >
                          Atlantium
                        </MenuItem>
                        <MenuItem
                          value="Calderas"
                        >
                          Calderas
                        </MenuItem>
                        <MenuItem
                          value="CIP"
                        >
                          CIP
                        </MenuItem>
                        <MenuItem
                          value="Condensadores"
                        >
                          Condensadores
                        </MenuItem>
                        <MenuItem
                          value="Enjuagador Linea 2"
                        >
                          Enjuagador Linea 2
                        </MenuItem>
                        <MenuItem
                          value="JAPAMA"
                        >
                          JAPAMA
                        </MenuItem>
                        <MenuItem
                          value="Jarabes"
                        >
                          Jarabes
                        </MenuItem>
                        <MenuItem
                          value="Jarabes Linea 2"
                        >
                          Jarabes Linea 2
                        </MenuItem>
                        <MenuItem
                          value="Lavadora Linea 1"
                        >
                          Lavadora Linea 1
                        </MenuItem>
                        <MenuItem
                          value="Lavadora Linea 3"
                        >
                          Lavadora Linea 3
                        </MenuItem>
                        <MenuItem
                          value="Lavadora Linea 5"
                        >
                          Lavadora Linea 5
                        </MenuItem>
                        <MenuItem
                          value="Microfiltrado"
                        >
                          Microfiltrado
                        </MenuItem>
                        <MenuItem
                          value="Permeada"
                        >
                          Permeada
                        </MenuItem>
                        <MenuItem
                          value="Prep Bebida L1"
                        >
                          Prep Bebida L1
                        </MenuItem>
                        <MenuItem
                          value="Prep Bebida L2"
                        >
                          Prep Bebida L2
                        </MenuItem>
                        <MenuItem
                          value="Prep Bebida L3"
                        >
                          Prep Bebida L3
                        </MenuItem>
                        <MenuItem
                          value="Rechazo Osmosis"
                        >
                          Rechazo Osmosis
                        </MenuItem>
                        <MenuItem
                          value="Recuperada"
                        >
                          Recuperada
                        </MenuItem>
                        <MenuItem
                          value="Suavizada"
                        >
                          Suavizada
                        </MenuItem>
                        <MenuItem
                          value="Tanque reactor"
                        >
                          Tanque reactor
                        </MenuItem>
                        <MenuItem
                          value="TAXTES"
                        >
                          TAXTES
                        </MenuItem>
                        <MenuItem
                          value="Torre Contacto Linea 2"
                        >
                          Torre Contacto Linea 2
                        </MenuItem>
                        <MenuItem
                          value="Torre Contacto Linea 5"
                        >
                          Torre Contacto Linea 5
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Stack>
                </MDBox>
                {/* <Line data={state} */}
                <Line data={state2}
                  options={
                    {
                      plugins: {
                        title: {
                          display: true,
                          text: 'Grafica de consumo por tiempo',
                          //align: 'right',
                          fontSize: 20
                        },
                        legend: {
                          display: false,
                          position: 'top'
                        }
                      }
                    }}
                />
              </Card>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
    </>
  );
}

export default AguaScreem;

/*import ReactTooltip from 'react-tooltip'
<ReactTooltip 
              id='btnDownload'
              place='bottom'
              //type='info'
              effect='solid'
              backgroundColor='#5596F9'
            >
              Descargar reporte
            </ReactTooltip>
data-tip data-for='btnDownload' */ 