import { Checkbox, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core'
import React, { useState } from 'react'
import styled from 'styled-components'
import { useUpdate } from '../../../../store/updateStore'
import EditIcon from '@material-ui/icons/Edit'

export default function BookListItem({ id, name, style, handleToggle, checked }) {

    return (
        <ListItem
            ContainerProps={{ style: style }}
            ContainerComponent="div"
            selected={checked}
            button key={id}
            onClick={handleToggle(id)}>
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={checked} />
            </ListItemIcon>
            <ListItemText primary={`${name}`} />
            <ListItemSecondaryAction>
                <IconButton aria-label="Edit">
                    <EditIcon />
                </IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
}