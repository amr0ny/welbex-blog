import { Component, useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';


class Field extends Component {
    constructor(props) {
      super(props);
      this.state = {
        message: null,
      };
    }
  
    handleSubmit = async (event) => {
      event.preventDefault();
      const { message } = this.state;
      const postData = {
        message: message
      };
      try {
        if (message) {
            const response = await fetch(`http://127.0.0.1:3010/api/createpost`, {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
                body: JSON.stringify(postData),
            });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        if (this.props.onChange)
            this.props.onChange();
        } else {
          // Реализация всплывающего окна (Пустое сообщение)
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    handleMessageChange = (e) => {
      this.setState({ message: e.target.value });
    };
  
    render() {
      return (
        <Card className="my-2" bg="light" style={{ borderRadius: '25px', borderColor: 'none' }}>
          <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
            <Form style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '10px' }} onSubmit={this.handleSubmit}>
              <Form.Control as="textarea" type="text" placeholder="Enter your post" value={this.state.message} onChange={this.handleMessageChange} />
              <Button variant="primary" type="submit" >Submit</Button>
            </Form>
          </Card.Body>
        </Card>
      );
    }
  }

class UpdateField extends Field {
    constructor(props) {
        super(props);
        this.state = {
            post_id: props.post_id,
            message: props.message,
        }
    }
    handleSubmit = async (event) => {
        event.preventDefault();
        const {post_id, message } = this.state;
        const postData = {
            post_id: post_id,
            message: message
        }
        fetch('http://127.0.0.1:3010/api/editpost', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
            },
            body: JSON.stringify(postData)
        })
        .then(response => {
            if (!response.json().ok)
                throw new Error("Network response was not ok");
    })
        .then(this.props.onChange(this.state.message)) //Почему здесь message – undefined
        .catch(error => console.error(error.message))
    }
}
export  {Field, UpdateField };