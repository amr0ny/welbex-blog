import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Button } from 'react-bootstrap';

function SignIn () {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const userData = {
            email: email,
            password: password
        };
        try {
            const response = await fetch(`http://127.0.0.1:3010/api/userslogin`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${sessionStorage.getItem('token')}`,
              },
              body: JSON.stringify(userData),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error("Network response was not ok");
              }
            if (data.token) {
                sessionStorage.setItem('token', data.token);
                return navigate('/');
            }
            else {
                // Реализация всплывающего окна (Неверный логин или пароль)
            }
        } catch (error) {
            console.error(error);
        }
      };
    return (
        <div className="Auth">
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Form onSubmit={handleSubmit} style={{ maxWidth: '500px', width: '100%' }}>
                    <h2 className="text-center mb-4">Вход</h2>
                    <Form.Group className="row mt-3" controlId="formBasicEmail">
                        <Form.Label className="col-form-label col-sm-3">Email:</Form.Label>
                        <div className="col-sm-9">
                        <Form.Control type="email" placeholder="Введите email" onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                    </Form.Group>

                    <Form.Group className="row mt-3" controlId="formBasicPassword">
                        <Form.Label className="col-form-label col-sm-3">Пароль:</Form.Label>
                        <div className="col-sm-9">
                        <Form.Control type="password" placeholder="Введите пароль" onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                    </Form.Group>

                    <Form.Group className="d-flex justify-content-end mt-3">
                        <div className="d-flex justify-content-end mt-3">
                            <div className="mr-3 align-self-center">
                                <Card.Link href="/register" className="mt-3">
                                    Нет аккаунта?
                                </Card.Link>
                            </div>
                            <Button variant="primary" type="submit">
                                Вход
                            </Button>
                        </div>
                    </Form.Group>
                </Form>
            </div>
        </div>


    );
}

export default SignIn;