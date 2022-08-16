import React, { useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr'
import { Button, Input, notification } from 'antd'
function App() {
  const [connection, setConnection] = useState<null | HubConnection>(null)
  const [inputText, setInputText] = useState('')

  useEffect(() => {
    const connect = new HubConnectionBuilder()
      .withUrl('https://localhost:7184/notification')
      .withAutomaticReconnect()
      .build()

    setConnection(connect)
  }, [])
  const sendMessage = async () => {
    if (connection) await connection.send('SendMessage', inputText)
    setInputText('')
  }
  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          connection.on('ReceiveMessage', (message) => {
            notification.open({
              message: 'New Notification',
              description: message
            })
          })
        })
        .catch((error) => console.log(error))
    }
  }, [connection])
  return (
    <div className='App'>
      <Input
        value={inputText}
        onChange={(input) => {
          setInputText(input.target.value)
        }}
      />
      <Button onClick={sendMessage} type='primary'>
        Send
      </Button>
    </div>
  )
}

export default App
