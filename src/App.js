import './App.css';
import { useState } from 'react';
import axios from 'axios';
import {
  FormControl, InputGroup, Button, Card,
} from 'react-bootstrap';
import constants from './constants';

const App = () => {
  const [username, setUsername] = useState('');
  const [tweets, setTweets] = useState([]);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleSearchClick = async () => {
    let options = {
      method: 'GET',
      url: constants.URLs.findByUsername,
      params: {
        username,
      },
    };
    const userDetails = await axios(options);
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
      setTweets(tweetsData.data.data);
    } else {
      setTweets([]);
      alert('User not found!');
    }
  };

  return (
    <div className="App">
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Twitter username"
          aria-label="Twitter username"
          aria-describedby="basic-addon2"
          onChange={(e) => handleUsernameChange(e)}
          value={username}
        />
        <Button variant="outline-secondary" id="button-addon2" onClick={() => handleSearchClick()}>
          Search
        </Button>
      </InputGroup>
      {
        (tweets.length > 0) && (tweets.map((tweet) => (
          <div className="Tweet-card">
            <Card body>{tweet.text}</Card>
          </div>
        ))
        )
      }
    </div>
  );
};

export default App;
