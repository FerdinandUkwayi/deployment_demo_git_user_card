import React from 'react';

import './App.css';

const axios = require('axios');

const CardList = (props) => {
  return (
    <div>
      {props.profiles.map(profile => <Card key={profile.id} {...profile} />)}
    </div>
  )
}

class Card extends React.Component {
  render() {
    const profile = this.props;
    return (
      <div className='github-profile' style={{ margin: '1rem' }}>
        <img src={profile.avatar_url} alt='user_avatar' />
        <div className="info" style={{ display: 'inline-block', marginLeft: 25 }}>
          <div className="name" style={{ fontSize: '125%' }}>{profile.name}</div>
          <div className="company">{profile.company}</div>
        </div>
      </div>
    )
  }
}

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = { username: '' };
    this.onChange = this.handleChange.bind(this);
    this.onSubmit = this.handleSubmit.bind(this);
  }

  handleChange = (e) => {
    this.setState({ username: e.target.value })
  }

  handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resp = await
        axios.get(`https://api.github.com/users/${this.state.username}`);
      this.props.onSubmit(resp.data);
    }
    catch (err) {
      console.log(err.response)
      if (err.response.status === 404) {
        alert("No such user found");
      } else if (err.response.status === 503) {
        alert("No network connection!")
      }
    }
    this.setState({ username: '' })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type='text'
          value={this.state.username}
          placeholder="Github username"
          onChange={this.handleChange}
          required />
        <input
          type="submit"
          value="Add card" />
      </form>
    )
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { profiles: [] }
  }

  addNewProfile = (profileData) => {
    this.setState(prevState => ({
      profiles: [...prevState.profiles, profileData]
    }));
  };

  render() {
    return (
      <div>
        <div className='header'>{this.props.title}</div>
        <Form onSubmit={this.addNewProfile} />
        <CardList profiles={this.state.profiles} />
      </div>
    )
  }
}

export default App;
