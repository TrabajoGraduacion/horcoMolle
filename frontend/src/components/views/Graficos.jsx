import React, { useEffect, useState, useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import * as echarts from "echarts";
import "echarts/lib/component/tooltip";
import "../../css/grafico.css";
import Select from "react-select";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import axios from 'axios';
import { FaFilePdf, FaFileImage, FaCalendar, FaEye, FaChartBar, FaCalendarAlt, FaCheck, FaFileExport, FaChartLine, FaPalette, FaRuler } from 'react-icons/fa';
import logoEmpresa from '../../assets/logopng2.png';
import { AuthContext } from '../../../context/AuthContext';

function Grafico() {
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [chartInstance, setChartInstance] = useState(null);
    const [selectedChart, setSelectedChart] = useState('animales');
    const [showExportDropdown, setShowExportDropdown] = useState(false);
    const [eventosAnimales, setEventosAnimales] = useState({});
    const [eventosRecintos, setEventosRecintos] = useState({});
    const [selectedMonths, setSelectedMonths] = useState(Array(12).fill(true));
    const [showFilters, setShowFilters] = useState(false);
    const [chartType, setChartType] = useState('bar');
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [labelRotation, setLabelRotation] = useState(30);
    const { user } = useContext(AuthContext);
    
    const options = [
        { value: 'animales', label: 'Eventos de Animales' },
        { value: 'recintos', label: 'Eventos de Recintos' }
    ];

    const years = Array.from({length: 5}, (_, i) => new Date().getFullYear() - i);
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    const obtenerDatosEventos = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}reportes/eventosPorMes`);
            const datos = response.data;

            let datosAnimales = {};
            let datosRecintos = {
                'Evaluacion': Array(12).fill(0),
                'Modificacion': Array(12).fill(0)
            };

            // Inicializar arrays para cada tipo de evento
            Object.entries(datos).forEach(([fecha, eventos]) => {
                Object.keys(eventos).forEach(tipoEvento => {
                    if (tipoEvento !== 'Modificación Recinto' && tipoEvento !== 'Evaluación Recinto') {
                        if (!datosAnimales[tipoEvento]) {
                            datosAnimales[tipoEvento] = Array(12).fill(0);
                        }
                    }
                });
            });

            // Llenar los datos según el año seleccionado
            Object.entries(datos).forEach(([fecha, eventos]) => {
                const [mes, año] = fecha.split('/').map(Number);
                
                if (!isNaN(mes) && !isNaN(año) && año === selectedYear) {
                    Object.entries(eventos).forEach(([tipoEvento, cantidad]) => {
                        if (tipoEvento === 'Modificación Recinto') {
                            datosRecintos['Modificacion'][mes - 1] += cantidad;
                        }
                        else if (tipoEvento === 'Evaluación Recinto') {
                            datosRecintos['Evaluacion'][mes - 1] += cantidad;
                        }
                        else {
                            datosAnimales[tipoEvento][mes - 1] += cantidad;
                        }
                    });
                }
            });

            setEventosAnimales(datosAnimales);
            setEventosRecintos(datosRecintos);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    const processData = () => {
        if (chartInstance) {
            const mesesFiltrados = meses.filter((_, index) => selectedMonths[index]);
            const datosAMostrar = selectedChart === 'animales' ? eventosAnimales : eventosRecintos;
            
            const seriesData = Object.entries(datosAMostrar).map(([key, values]) => ({
                name: key,
                type: chartType,
                data: values.filter((_, index) => selectedMonths[index]),
                emphasis: {
                    focus: 'series'
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}',
                    fontSize: 12,
                    fontWeight: 'bold'
                },
                animation: true,
                animationDuration: 1000,
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return idx * 100;
                }
            }));

            const option = {
                backgroundColor: backgroundColor,
                title: [
                    {
                        text: selectedChart === 'animales' ? 'Eventos de Animales' : 'Eventos de Recintos',
                        left: 'center',
                        top: '2%',
                        textStyle: {
                            fontSize: 26,
                            fontWeight: 'bold'
                        }
                    }
                ],
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                legend: {
                    data: Object.keys(datosAMostrar),
                    top: '12%',
                    textStyle: {
                        fontSize: 14
                    }
                },
                grid: {
                    top: '25%',
                    bottom: '5%',
                    containLabel: true,
                    backgroundColor: '#ffffff'
                },
                xAxis: {
                    type: 'category',
                    data: mesesFiltrados,
                    axisLabel: {
                        interval: 0,
                        rotate: labelRotation,
                        fontSize: 12,
                        fontWeight: 'bold'
                    }
                },
                yAxis: {
                    type: 'value',
                    name: 'Cantidad',
                    nameLocation: 'middle',
                    nameGap: 50
                },
                animation: true,
                animationThreshold: 2000,
                animationDuration: 1000,
                animationEasing: 'elasticOut',
                animationDelay: function (idx) {
                    return idx * 100;
                },
                animationDurationUpdate: 1000,
                animationEasingUpdate: 'elasticOut',
                animationDelayUpdate: function (idx) {
                    return idx * 100;
                },
                series: seriesData
            };

            chartInstance.setOption(option, true);
            chartInstance.resize();
        }
    };

    useEffect(() => {
        obtenerDatosEventos();
        initChart();
        return () => {
            if (chartInstance) {
                chartInstance.dispose();
            }
        };
    }, [selectedYear]);

    useEffect(() => {
        if (chartInstance) {
            processData();
            window.addEventListener('resize', handleResize);
        }
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [
        chartInstance, 
        selectedYear, 
        selectedChart, 
        eventosAnimales, 
        eventosRecintos, 
        selectedMonths,
        chartType,
        backgroundColor,
        labelRotation
    ]);

    const handleResize = () => {
        if (chartInstance) {
            chartInstance.resize();
        }
    };

    const initChart = () => {
        const chartDom = document.getElementById('chart');
        if (chartDom) {
            const chart = echarts.init(chartDom);
            setChartInstance(chart);
        }
    };

    const exportToPNG = () => {
        const chartDom = document.getElementById('chart');
        html2canvas(chartDom, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            removeContainer: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `grafico-${selectedChart}-${new Date().toISOString()}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            link.click();
        });
    };

    const exportToPDF = () => {
        const chartDom = document.getElementById('chart');
        html2canvas(chartDom, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            removeContainer: true
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('l', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            
            // Ajustar tamaño del logo
            const logoWidth = 40;
            const logoHeight = 40;
            const logoX = pdfWidth - logoWidth - 10;
            const logoY = 10;
            pdf.addImage(logoEmpresa, 'PNG', logoX, logoY, logoWidth, logoHeight);

            // Agregar título
            pdf.setFontSize(18);
            pdf.setTextColor(44, 62, 80);
            pdf.text('Reporte de Eventos', 20, 20);

            // Agregar información del reporte
            pdf.setFontSize(10);
            pdf.setTextColor(100, 100, 100);
            
            // Fecha y hora
            const fecha = new Date().toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            const hora = new Date().toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });
            pdf.text(`Fecha de emisión: ${fecha}`, 20, 30);
            pdf.text(`Hora: ${hora}`, 20, 35);

            // Usuario que emite el reporte
            pdf.text(`Usuario: ${user?.nombre + ' ' + user?.apellido || 'No especificado'}`, 20, 40);

            // Tipo de reporte
            pdf.text(`Tipo de reporte: ${selectedChart === 'animales' ? 'Eventos de Animales' : 'Eventos de Recintos'}`, 20, 45);
            pdf.text(`Año filtrado: ${selectedYear}`, 20, 50);

            // Agregar línea separadora
            pdf.setDrawColor(142, 190, 148);  // Color #8ebe94
            pdf.setLineWidth(0.5);
            pdf.line(20, 55, pdfWidth - 20, 55);

            // Ajustar posición y tamaño del gráfico
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min((pdfWidth - 10) / imgWidth, (pdfHeight - 90) / imgHeight);
            const imgX = 5;
            const imgY = 70;

            pdf.addImage(imgData, 'PNG', imgX, imgY, pdfWidth - 10, (imgHeight * ratio));

            // Ajustar posición del pie de página si es necesario
            pdf.setFontSize(8);
            pdf.setTextColor(150, 150, 150);
            pdf.text('©  Horco Molle - Todos los derechos reservados', pdfWidth/2, pdfHeight - 5, { align: 'center' });

            pdf.save(`reporte-${selectedChart}-${fecha.replace(/\//g, '-')}.pdf`);
        });
    };

    // Agregar esta función para verificar si todos los meses están seleccionados
    const areAllMonthsSelected = () => selectedMonths.every(month => month === true);

    return (
        <div className="container-fluid p-4 d-flex flex-column min-vh-100">
            <div className="row mb-4">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h5 className="card-title m-0" style={{ color: '#2c3e50' }}>
                                    <FaChartBar className="me-2" style={{ color: '#8ebe94' }}/>
                                    Configuración del Gráfico
                                </h5>
                                <h5 className="card-title m-0" style={{ color: '#2c3e50' }}>
                                    Personalización
                                </h5>
                            </div>
                            <div className="d-flex gap-4">
                                <div style={{ flex: '1' }}>
                                    <div className="mb-3">
                                        <label className="form-label">Tipo de Gráfico</label>
                                        <Select
                                            options={options}
                                            onChange={(option) => {
                                                setSelectedChart(option.value);
                                                processData();
                                            }}
                                            value={options.find(opt => opt.value === selectedChart)}
                                            placeholder="Seleccione tipo"
                                            className="basic-single"
                                            classNamePrefix="select"
                                        />
                                    </div>
                                    <div>
                                        <label className="form-label">Año</label>
                                        <Select
                                            options={years.map(year => ({ value: year, label: year }))}
                                            value={{ value: selectedYear, label: selectedYear }}
                                            onChange={(option) => {
                                                setSelectedYear(option.value);
                                                obtenerDatosEventos();
                                            }}
                                            className="basic-single"
                                            classNamePrefix="select"
                                        />
                                    </div>
                                </div>
                                
                                <div className="border-start ps-4" style={{ flex: '1' }}>
                                    <div className="d-flex flex-column gap-3">
                                        <div>
                                            <label className="form-label d-flex align-items-center">
                                                <FaChartLine className="me-2" size={14}/>
                                                Estilo de Visualización
                                            </label>
                                            <Select
                                                options={[
                                                    { value: 'bar', label: 'Barras' },
                                                    { value: 'line', label: 'Líneas' }
                                                ]}
                                                value={{ 
                                                    value: chartType, 
                                                    label: chartType === 'bar' ? 'Barras' : 'Líneas' 
                                                }}
                                                onChange={(option) => {
                                                    setChartType(option.value);
                                                }}
                                                className="basic-single"
                                                classNamePrefix="select"
                                            />
                                        </div>
                                        
                                        <div className="d-flex gap-4">
                                            <div style={{ flex: '1' }}>
                                                <label className="form-label d-flex align-items-center">
                                                    <FaPalette className="me-2" size={14}/>
                                                    Color de Fondo
                                                </label>
                                                <div className="d-flex gap-2">
                                                    {['#ffffff', '#f8f9fa', '#e9ecef', '#f0f8f1'].map(color => (
                                                        <button
                                                            key={color}
                                                            className={`btn btn-sm ${backgroundColor === color ? 'border-dark' : 'border'}`}
                                                            style={{
                                                                backgroundColor: color,
                                                                width: '30px',
                                                                height: '30px',
                                                                padding: 0,
                                                                borderRadius: '50%'
                                                            }}
                                                            onClick={() => {
                                                                setBackgroundColor(color);
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            
                                            <div style={{ flex: '1' }}>
                                                <label className="form-label d-flex align-items-center">
                                                    <FaRuler className="me-2" size={14}/>
                                                    Rotación de Etiquetas
                                                </label>
                                                <div className="btn-group">
                                                    {[0, 30, 45, 90].map(angle => (
                                                        <button
                                                            key={angle}
                                                            className={`btn btn-sm ${labelRotation === angle ? 'btn-success' : 'btn-outline-success'}`}
                                                            style={{
                                                                backgroundColor: labelRotation === angle ? '#8ebe94' : 'white',
                                                                borderColor: '#8ebe94',
                                                                color: labelRotation === angle ? 'white' : '#8ebe94'
                                                            }}
                                                            onClick={() => {
                                                                setLabelRotation(angle);
                                                            }}
                                                        >
                                                            {angle}°
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <h5 className="card-title m-0" style={{ color: '#2c3e50' }}>
                                    <FaCalendarAlt className="me-2" style={{ color: '#8ebe94' }}/>
                                    Filtro por Meses
                                </h5>
                                <button
                                    className="btn btn-outline-success btn-sm"
                                    onClick={() => {
                                        if (areAllMonthsSelected()) {
                                            // Si todos están seleccionados, deseleccionar todos
                                            setSelectedMonths(Array(12).fill(false));
                                        } else {
                                            // Si no todos están seleccionados, seleccionar todos
                                            setSelectedMonths(Array(12).fill(true));
                                        }
                                    }}
                                    style={{
                                        border: '1px solid #8ebe94',
                                        color: '#8ebe94'
                                    }}
                                >
                                    <FaCheck className="me-1"/>
                                    {areAllMonthsSelected() ? 'Descartar Selecciones' : 'Seleccionar Todos'}
                                </button>
                            </div>
                            <div className="d-flex flex-wrap gap-2">
                                {meses.map((mes, index) => (
                                    <button
                                        key={mes}
                                        className={`btn btn-sm ${selectedMonths[index] ? 'btn-success' : 'btn-outline-success'}`}
                                        onClick={() => {
                                            const newSelectedMonths = [...selectedMonths];
                                            newSelectedMonths[index] = !newSelectedMonths[index];
                                            setSelectedMonths(newSelectedMonths);
                                        }}
                                        style={{
                                            backgroundColor: selectedMonths[index] ? '#8ebe94' : 'white',
                                            border: `1px solid #8ebe94`,
                                            color: selectedMonths[index] ? 'white' : '#8ebe94',
                                            minWidth: '100px',
                                            transition: 'all 0.3s ease',
                                            transform: selectedMonths[index] ? 'scale(1.05)' : 'scale(1)',
                                            boxShadow: selectedMonths[index] ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                                        }}
                                    >
                                        <span className="d-flex align-items-center justify-content-center">
                                            {selectedMonths[index] && <FaCheck className="me-1" size={12}/>}
                                            {mes}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="position-relative flex-grow-1">
                <div 
                    id="chart" 
                    className="chart" 
                    style={{ 
                        height: '500px',
                        width: '100%',
                        maxWidth: '1800px',
                        margin: '0 auto'
                    }}
                />
            </div>

            <div className="position-fixed bottom-0 end-0 p-4" style={{ zIndex: 1000 }}>
                <div className="dropdown">
                    <button 
                        className="btn btn-lg shadow-lg dropdown-toggle"
                        type="button"
                        onClick={() => setShowExportDropdown(!showExportDropdown)}
                        style={{ 
                            backgroundColor: '#8ebe94', 
                            color: 'white',
                            minWidth: '150px'
                        }}
                    >
                        <FaFileExport className="me-2"/>
                        Exportar
                    </button>
                    {showExportDropdown && (
                        <div className="dropdown-menu show shadow-lg" 
                             style={{ 
                                 minWidth: '150px',
                                 transform: 'translate(-20px, -100%)',
                                 marginBottom: '10px'
                             }}>
                            <button 
                                className="dropdown-item d-flex align-items-center gap-2 py-2" 
                                onClick={() => {
                                    exportToPDF();
                                    setShowExportDropdown(false);
                                }}
                            >
                                <FaFilePdf style={{ color: '#ff0000' }} /> Exportar a PDF
                            </button>
                            <button 
                                className="dropdown-item d-flex align-items-center gap-2 py-2" 
                                onClick={() => {
                                    exportToPNG();
                                    setShowExportDropdown(false);
                                }}
                            >
                                <FaFileImage style={{ color: '#8ebe94' }} /> Exportar a PNG
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Grafico;