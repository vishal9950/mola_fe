import './App.css';
import { useState } from 'react';
import axios from 'axios';
import {
  FormControl, InputGroup, Button, Card,
} from 'react-bootstrap';
import constants from './constants';
import Header from './Component/Header/Header';

const App = () => {
  const [username, setUsername] = useState('');
  const [tweets, setTweets] = useState([]);
  const [isUser, setIsUser] = useState(true);
  const [apiError, setApiError] = useState('');

  const handleUsernameChange = (e) => {
    if (e.target.value === '') {
      setTweets([]);
    }
    setUsername(e.target.value);
    setTweets([]);
    setIsUser(true);
  };

  const handleSearchClick = async () => {
    try {
      let options = {
        method: 'GET',
        url: constants.URLs.findByUsername,
        params: {
          username,
        },
      };
      const userDetails = await axios(options);
      if (userDetails.data) {
        if (userDetails.data.data) {
          const { id } = userDetails.data.data;
          options = {
            method: 'GET',
            url: constants.URLs.userTweets,
            params: {
              id,
            },
          };
          const tweetsData = await axios(options);
          if (tweetsData.data) {
            if (tweetsData.data.data) {
              setTweets(tweetsData.data.data);
              setIsUser(true);
              setApiError('');
            } else {
              setTweets([]);
              setIsUser(true);
              setApiError('Something went wrong. Please try again.');
            }
          } else {
            setTweets([]);
            setIsUser(true);
            setApiError('Something went wrong. Please try again.');
          }
        } else {
          setTweets([]);
          setIsUser(false);
        }
      } else {
        setTweets([]);
        setIsUser(true);
        setApiError('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.log(err);
      setTweets([]);
      setIsUser(true);
      setUsername('');
    }
  };

  const downloadFile = async () => {
    const fileName = 'tweets';
    const json = JSON.stringify(tweets);
    const blob = new Blob([json], { type: 'application/json' });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="App">
      <Header />
      <InputGroup className="SearchBox">
        <FormControl
          className="SearchBox-Input"
          placeholder="Twitter username"
          onChange={(e) => handleUsernameChange(e)}
          value={username}
        />
        <Button className="SearchBox-Button" variant="outline-secondary" id="button-addon2" onClick={() => handleSearchClick()}>
          Search
        </Button>
        <Button disabled={tweets.length === 0} className="SearchBox-Button" variant="outline-secondary" id="button-addon2" onClick={() => downloadFile()}>
          Download
        </Button>

      </InputGroup>
      {(apiError !== '') && (<div className="Error-msg">{apiError}</div>)}
      {(!isUser) && (<div className="Error-msg">User not found!</div>)}
      {
        (tweets.length > 0) && (tweets.map((tweet) => (
          <div key={tweet.id} className="Tweet-card">
            <Card body>{tweet.text}</Card>
          </div>
        ))
        )
      }
    </div>
  );
};

export default App;
