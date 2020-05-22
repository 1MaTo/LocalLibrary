import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { KeyboardDatePicker } from '@material-ui/pickers';

export function DatePicker({ props, label, views, format = "DD/MM/YYYY" }) {

    return (
        <KeyboardDatePicker
            views={views}
            variant="inline"
            format={format}
            value={props.input.value}
            placeholder="дд/мм/гггг"
            autoOk={true}
            label={label}
            minDateMessage={'Дата должна быть не меньше допустимого значения'}
            maxDateMessage={'Дата должна быть не больше допустимого значения'}
            invalidDateMessage={'Введите корректную дату'}
            onChange={date => props.input.onChange(date.format())}
        />
    )
}