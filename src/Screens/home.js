import React from 'react';
import {Container} from 'react-bootstrap';
import Form from '../Components/Form';
import '../App.css'; 
export default function Home(){
  return(
    <div style={{marginTop: 50}}>
      <Container>
        <Form/>
      </Container>
    </div>
  )
}