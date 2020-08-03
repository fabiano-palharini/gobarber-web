import React, { useState, useCallback, useEffect, useMemo } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import logoImg from '../../assets/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';
import { Container, Header, HeaderContent, Profile, Content, Schedule, Section ,Calendar, Appointment, NextAppointment } from './styles';
import { useAuth } from '../../hooks/auth';
import api from '../../services/api';


interface MonthAvailabilityItem {
  day: number;
  available: boolean;
}


const Dashboard: React.FC = () => {
  const [ selectedDate, setSelectedDate ] = useState(new Date());
  const [ currentMonth, setCurrentMonth ] = useState(new Date());
  const [ monthAvailability, setMonthAvailability ] = useState<MonthAvailabilityItem[]>([]);

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
          <span>Today</span>
          <span>Day 06</span>
          <span>Monday</span>
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
          <Appointment>
            <span>
              <FiClock />
              08:00
            </span>
            <div>
              <img src="https://avatars1.githubusercontent.com/u/32514208?s=460&v=4" alt="Fabiano Falco"/>
              <strong>Fabiano Falco</strong>
            </div>
          </Appointment>
          <Appointment>
            <span>
              <FiClock />
              10:00
            </span>
            <div>
              <img src="https://avatars1.githubusercontent.com/u/32514208?s=460&v=4" alt="Fabiano Falco"/>
              <strong>Fabiano Falco</strong>
            </div>
          </Appointment>
        </Section>

        <Section>
          <strong>Afternoon</strong>
          <Appointment>
            <span>
              <FiClock />
              13:00
            </span>
            <div>
              <img src="https://avatars1.githubusercontent.com/u/32514208?s=460&v=4" alt="Fabiano Falco"/>
              <strong>Fabiano Falco</strong>
            </div>
          </Appointment>
          <Appointment>
            <span>
              <FiClock />
              15:00
            </span>
            <div>
              <img src="https://avatars1.githubusercontent.com/u/32514208?s=460&v=4" alt="Fabiano Falco"/>
              <strong>Fabiano Falco</strong>
            </div>
          </Appointment>
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
