import React, { useState, useCallback } from 'react';
import DayPicker, { DayModifiers } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import logoImg from '../../assets/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';
import { Container, Header, HeaderContent, Profile, Content, Schedule, Section ,Calendar, Appointment, NextAppointment } from './styles';
import { useAuth } from '../../hooks/auth';



const Dashboard: React.FC = () => {
  const [ selectedDate, setSelectedDate ] = useState(new Date());
  const { signOut, user } = useAuth();

  const handleDateChange = useCallback((day: Date, modifiers: DayModifiers) => {
    if (modifiers.available ) {
      setSelectedDate(day);
    }
  }, [])

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
          disabledDays={[{daysOfWeek: [0,6]}]}
          modifiers={{
            available: {daysOfWeek: [1,2,3,4,5]}
          }}
          onDayClick={ handleDateChange }
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
