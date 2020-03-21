import React from 'react';
import styled from 'styled-components'
import { useDropzone } from 'react-dropzone';

const FileInputForm = styled.div`
    position: absolute;
    border-radius: 50%;
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    width: 150px;
    height: 150px;
    outline: none;
    display: flex;
    text-align: center;
    align-items: center;
    justify-content: center;
    font-size: 1.1em;
    color: rgba(0,0,0,0);
    &:hover {
        cursor: pointer;
        color: rgb(255,255,255);
        background: rgba(0,0,0,0.4)
    }
`

export function FileInput(props) {

    const { getRootProps, getInputProps } = useDropzone({
        accept: props.formats,
        multiple: false,
        onDrop: acceptedFiles => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (props.onChange) {
                    props.onChange(event.target.result)
                    props.image(event.target.result)
                }
            }
            reader.readAsDataURL(acceptedFiles[0])
        }
    });

    return (
        <FileInputForm {...getRootProps()}>
            <span>{props.text}</span>
            <input {...getInputProps()} />
        </FileInputForm>
    );
}