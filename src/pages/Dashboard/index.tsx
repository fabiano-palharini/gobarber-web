import React from 'react';

import logoImg from '../../assets/logo.svg';
import { FiPower, FiClock } from 'react-icons/fi';
import { Container, Header, HeaderContent, Profile, Content, Schedule, Calendar, NextAppointment } from './styles';
import { useAuth } from '../../hooks/auth';

const Dashboard: React.FC = () => {
  const { signOut, user } = useAuth();

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
      </Schedule>

      <Calendar />
    </Content>
  </Container>
  );
};

export default Dashboard;
