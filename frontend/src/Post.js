import { useState } from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import { UpdateField } from './Field';
function Post(props) {

  const [ editing, setEditing ] = useState(false);
  const { post_id, username, timestamp } = props;
  const [ message, setMessage ] = useState(props.message);
  const handleDeleteButton = async () =>  {
    const postData = {
      post_id: post_id
    }
    try {
      const response = await fetch(`http://127.0.0.1:3010/api/deletepost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(postData),
      })
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleChange = (msg) => {
    setEditing(false);
    setMessage(msg);
    console.log("HERE WE ARE!");
  }
  return (
    <>
      {!editing ? (
        <Card id={post_id} className="my-2" bg="light" style={{ borderRadius: '25px', borderColor: 'none' }}>
          <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
            <Card.Text style={{ flexGrow: '1' }}>{message}</Card.Text>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button variant="link" onClick={() => setEditing(true)}>
                  <Image src="./edit.svg" width="20" height="20" alt="Edit" />
                </Button>
                <Button variant="link" onClick={async () => { handleDeleteButton() }}>
                  <Image src="./trash.svg" width="20" height="20" alt="Delete" />
                </Button>
              </div>
              <div style={{ display: 'flex', justifyContent: "flex-end", alignItems: "center" }}>
                <Card.Text style={{ fontStyle: 'italic', margin: '0' }}>‒{username},</Card.Text>
                <div style={{ fontStyle: 'italic', fontSize: '0.8rem', marginLeft: '10px' }}>{timestamp}</div>
              </div>
            </div>
          </Card.Body>
        </Card>
      ) : (
        <UpdateField post_id={post_id} message={message} onChange={(e) => handleChange(e)}/>
      )}
    </>
  );
}

export default Post;