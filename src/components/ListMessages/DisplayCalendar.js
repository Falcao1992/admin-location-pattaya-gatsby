import React from "react";
import Calendar from 'react-calendar'
import styled from "styled-components";

export const DisplayCalendar = ({rangeDate}) => {
    return (
            <CalendarStyled
            value={rangeDate}
            />
    )
};

const CalendarStyled = styled(Calendar)`
    box-shadow: 5px 5px 20px;
    margin: 2rem auto;
    `;

