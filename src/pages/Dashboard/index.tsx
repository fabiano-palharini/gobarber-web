import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import logoImg from '../../assets/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';
import { Container, Header, HeaderContent, Profile, Content, Schedule, Section ,Calendar, Appointment, NextAppointment } from './styles';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';
import { isToday, format } from 'date-fns';
import enUS from 'date-fns/locale/en-US'
import { parseISO } from 'date-fns/esm';


interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}


interface Appointment {
  id: string;
  date: string;
  formattedHour: string;
  user: {
    name: string;
    avatar_url: string;
  }
}

const Dashboard: React.FC = () => {
  const [ selectedDate, setSelectedDate ] = useState(new Date());
  const [ currentMonth, setCurrentMonth ] = useState(new Date());
  const [ monthAvailability, setMonthAvailability ] = useState<MonthAvailabilityItem[]>([]);
  const [ appointments, setAppointments ] = useState<Appointment[]>([]);

  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available ) {
      setSelectedDate(day);
    }
  }, [])


  const handleMonthChange = useCallback((month: Date) => {
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    api.get(`/providers/${user.id}/month-availability`, {
      params: {
        year: currentMonth.getFullYear(),
        month: currentMonth.getMonth() + 1,
      }
    }).then(response => {
      setMonthAvailability(response.data);
    })
  }, [currentMonth, user.id]);


  useEffect(() => {
    api.get<Appointment[]>('/appointments/me', {
      params: {
        year: selectedDate.getFullYear(),
        month: selectedDate.getMonth() + 1,
        day: selectedDate.getDate()
      }
    }).then(response=> {
      const formattedAppointments = response.data.map(appointment => {
        return {
          ...appointment,
          formattedHour: format(parseISO(appointment.date), 'HH:mm')
        }
      });
      setAppointments(formattedAppointments);
    })
  }, [selectedDate])



  const disabledDays = useMemo(() => {
    const dates = monthAvailability
                  .filter(monthDay => monthDay.available === false)
                  .map(monthDay => {
                    const year = currentMonth.getFullYear();
                    const month = currentMonth.getMonth();

                    return new Date(year, month, monthDay.day);
                  });
    return dates;
  }, [currentMonth, monthAvailability]);


  const selectedDateAsText = useMemo(() => {
    return format(selectedDate, "'Day' dd 'of' MMMM'", {
      locale: enUS
    })
  }, [selectedDate]);


  const selectedWeekday = useMemo(() => {
    return format(selectedDate, 'cccc')
  }, [selectedDate]);



  const morningAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() < 12;
    })
  }, [appointments]);

  const afternoonAppointments = useMemo(() => {
    return appointments.filter(appointment => {
      return parseISO(appointment.date).getHours() >= 12;
    })
  }, [appointments]);



  return (
    <Container>
    <Header>
      <HeaderContent>
        <img src={logoImg} alt="GoBarber" />
        <Profile>
          <img src={user.avatar_url} alt={user.name} />
          <div>
            <span>Bem-vindo, </span>
            <strong>{ user.name } </strong>
          </div>
        </Profile>

        <button type="button" onClick={signOut}>
          <FiPower />
        </button>

      </HeaderContent>
    </Header>

    <Content>
      <Schedule>
        <h1>Schedules</h1>
        <p>
          { isToday(selectedDate) && <span> Today</span> }
          <span>{selectedDateAsText}</span>
          <span>{selectedWeekday}</span>
        </p>
        <NextAppointment>
          <strong>Next Appointment</strong>
          <div>
            <img src="https://avatars1.githubusercontent.com/u/32514208?s=460&v=4" alt="Fabiano Falco" />
            <strong>Fabiano Falco</strong>
            <span>
              <FiClock />
              08:00
            </span>
          </div>
        </NextAppointment>

        <Section>
          <strong>Morning</strong>
          {morningAppointments.map((appointment) => (
            <Appointment key={appointment.id}>
              <span>
                <FiClock />
                {appointment.formattedHour}
              </span>
              <div>
                <img src={appointment.user.avatar_url} alt={appointment.user.name}/>
                <strong>{appointment.user.name}</strong>
              </div>
            </Appointment>
          ))}
        </Section>


        <Section>
          <strong>Afternoon</strong>
          {afternoonAppointments.map((appointment) => (
            <Appointment key={appointment.id}>
              <span>
                <FiClock />
                {appointment.formattedHour}
              </span>
              <div>
                <img src={appointment.user.avatar_url} alt={appointment.user.name}/>
                <strong>{appointment.user.name}</strong>
              </div>
            </Appointment>
          ))}
        </Section>
      </Schedule>

      <Calendar>
        <DayPicker
          weekdaysShort={['D','S','T','Q','Q','S','S']}
          fromMonth={new Date()}
          disabledDays={[{daysOfWeek: [0,6], ...disabledDays}]}
          modifiers={{
            available: {daysOfWeek: [1,2,3,4,5]}
          }}
          onDayClick={ handleDateChange }
          onMonthChange={handleMonthChange}
          selectedDays={selectedDate}
          months={[
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro',
                  ]}
        />
      </Calendar>
    </Content>
  </Container>
  );
};

export default Dashboard;
