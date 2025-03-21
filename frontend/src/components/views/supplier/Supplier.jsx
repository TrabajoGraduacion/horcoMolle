import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import axios from 'axios';
import ViewEventosCalendarioModal from './ViewEventosCalendarioModal';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';
import "react-datepicker/dist/react-datepicker.css";

// Registramos el locale español y lo establecemos como predeterminado
registerLocale('es', es);
setDefaultLocale('es');

const Supplier = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showEventosModal, setShowEventosModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedEvents, setSelectedEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_USUARIO}reportes/eventosAnimalRecinto`);
        const formattedEvents = response.data
          .filter(event => event.fecha)
          .map(event => ({
            date: event.fecha.slice(0, 10),
            title: `${event.tipo}${event.animalInfo ? ` - ${event.animalInfo}` : ''}${event.recintoInfo ? ` - ${event.recintoInfo}` : ''}`,
            id: event.id,
            tipo: event.tipo,
            animalId: event.animalId,
            nombreInstitucionalAnimal: event.animalInfo
          }));
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error al obtener eventos:', error);
      }
    };
  
    fetchEvents();
  }, []);

  const getOption = () => {
    const dateList = [];
    const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);

    for (let d = new Date(currentDate); d <= lastDay; d.setDate(d.getDate() + 1)) {
      dateList.push([
        d.toISOString().slice(0, 10),
        d.getDate().toString().padStart(2, '0'),
      ]);
    }

    const eventData = events.reduce((acc, event) => {
      const eventDate = event.date;
      if (!acc[eventDate]) {
        acc[eventDate] = [eventDate, 1, [{
          id: event.id,
          tipo: event.tipo,
          title: event.title,
          animalId: event.animalId,
          nombreInstitucionalAnimal: event.animalInfo
        }]];
      } else {
        acc[eventDate][2].push({
          id: event.id,
          tipo: event.tipo,
          title: event.title,
          animalId: event.animalId,
          nombreInstitucionalAnimal: event.animalInfo
        });
        acc[eventDate][1] += 1;
      }
      return acc;
    }, {});

    return {
      animation: false,
      tooltip: {
        formatter: function (params) {
          if (params.seriesIndex === 1) {
            return params.value[2]
              .map(evento => evento.tipo)  // Solo mostramos el tipo
              .join('<br>');
          }
          return '';
        }
      },
      calendar: [{
        left: '5%',
        right: '5%',
        top: '15%',
        bottom: '5%',
        cellSize: ['auto', 85],
        yearLabel: { show: false },
        orient: 'vertical',
        dayLabel: {
          firstDay: 1,
          nameMap: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
          color: '#70AA68',
          fontWeight: 'bold',
          fontSize: 14
        },
        monthLabel: {
          show: false
        },
        range: currentMonth.toISOString().slice(0, 7),
        itemStyle: {
          borderWidth: 0.5,
          borderColor: '#e0e0e0'
        }
      }],
      series: [
        {
          type: 'scatter',
          coordinateSystem: 'calendar',
          symbolSize: 1,
          animation: false,
          label: {
            show: true,
            formatter: function (params) {
              return params.value[1];
            },
            color: '#666',
            fontSize: 16,
            fontWeight: 'bold',
            position: 'top',
            offset: [0, -15]
          },
          data: dateList
        },
        {
          name: 'Eventos',
          type: 'scatter',
          coordinateSystem: 'calendar',
          symbolSize: 30,
          animation: false,
          itemStyle: {
            color: '#70AA68',
            borderRadius: 100
          },
          label: {
            show: true,
            formatter: function (params) {
              return params.value[2].length.toString();
            },
            color: '#fff',
            fontSize: 12,
            fontWeight: 'bold'
          },
          data: Object.values(eventData)
        }
      ]
    };
  };

  const handlePrevMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() - 1);
      return newMonth;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => {
      const newMonth = new Date(prevMonth);
      newMonth.setMonth(newMonth.getMonth() + 1);
      return newMonth;
    });
  };

  const onChartClick = (params) => {
    if (params.seriesIndex === 1) {
      const eventosDelDia = params.value[2].map(evento => ({
        id: evento.id,
        tipo: evento.tipo,
        fecha: params.value[0],
        animalId: evento.animalId,
        nombreInstitucionalAnimal: evento.nombreInstitucionalAnimal
      }));
      setSelectedDate(params.value[0]);
      setSelectedEvents(eventosDelDia);
      setShowEventosModal(true);
    }
  };

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => {
    const monthYear = new Intl.DateTimeFormat('es', { 
      month: 'long', 
      year: 'numeric' 
    }).format(currentMonth);
    
    return (
      <span 
        className="month-title fs-2 fw-bold mx-3 cursor-pointer" 
        onClick={onClick} 
        ref={ref}
        style={{ cursor: 'pointer' }}
      >
        {monthYear.charAt(0).toUpperCase() + monthYear.slice(1)}
      </span>
    );
  });

  return (
    <div className="container-fluid px-4">
      <div className="row justify-content-center mb-5">
        <div className="col-auto d-flex align-items-center">
          <button onClick={handlePrevMonth} className="calendar-nav-btn btn btn-link text-decoration-none">
            &lt;
          </button>
          <DatePicker
            selected={currentMonth}
            onChange={date => setCurrentMonth(date)}
            dateFormat="MMMM yyyy"
            showMonthYearPicker
            customInput={<CustomInput />}
            locale="es"
            showFullMonthYearPicker
            fixedHeight
            calendarClassName="custom-datepicker"
            monthsShown={1}
            shouldCloseOnSelect={true}
          />
          <button onClick={handleNextMonth} className="calendar-nav-btn btn btn-link text-decoration-none">
            &gt;
          </button>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <ReactECharts
            option={getOption()}
            style={{ height: '750px' }}
            className="w-100"
            notMerge={true}
            lazyUpdate={true}
            onEvents={{
              click: onChartClick
            }}
          />
        </div>
      </div>
      <ViewEventosCalendarioModal
        show={showEventosModal}
        handleClose={() => setShowEventosModal(false)}
        eventos={selectedEvents}
        fecha={selectedDate}
      />
    </div>
  );
};

export default Supplier;