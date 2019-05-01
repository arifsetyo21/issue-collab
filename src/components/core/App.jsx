/* eslint-disable react/destructuring-assignment */
import React from 'react';
import Title from './Title';
import SearchResults from '../search/SearchResults';
import '../../style.scss';
import '../../react-toggle.scss';

import Toggle from 'react-toggle';
import SearchBar from '../search/SearchBar';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggledLanguages: [],
      toggledLabels: {
        bug: false,
        easy: false,
        documentation: false,
        helpWanted: false,
      },
      searchText: '',
      issueState: 'open',
      results: {},
      url: '',
    };
  }

  // formatUrl = () => {
  //   const { issueState, toggledLabels, toggledLanguages, searchText } = this.state;
  //   const baseUrl = 'https://api.github.com/search/issues?q=type:issue';
  //   const sortOptions = '&sort=created&order=desc&per_page=30';
  //   let finalLabels = '';
  //   let finalLanguages = '';
  //   let finalText = '';

  //   finalLabels = toggledLabels.map(label => `+label:${label}`).join('');

  //   finalLanguages = toggledLanguages.map(language => `+language:${language}`).join('');

  //   if (searchText !== '') {
  //     finalText = `+${searchText}`;
  //   }

  //   const completeUrl = `${baseUrl +
  //     finalLabels +
  //     finalLanguages +
  //     finalText}+state:${issueState}${sortOptions}`;

  //   return completeUrl;
  // };

  formatUrl = () => {
    const { issueState, toggledLabels, toggledLanguages, searchText } = this.state;
    const baseUrl = 'https://api.github.com/search/issues?q=type:issue';
    const sortOptions = '&sort=created&order=desc&per_page=30';
    let finalLabels = '';
    //   let finalLanguages = '';
    let finalText = '';

    // Get enabled labels from state
    const activeLabels = Object.keys(toggledLabels).filter(item => toggledLabels[item]);

    //   finalLanguages = toggledLanguages.map(language => `+language:${language}`).join('');

    if (searchText !== '') {
      finalText = `+${searchText}`;
    }

    // Join labels together
    finalLabels = activeLabels.map(label => `+label:${label}`).join('');

    // Join all parts
    return `${baseUrl +
      finalLabels +
      // finalLanguages +
      finalText}+state:${issueState}${sortOptions}`;
  };

  getIssues = async event => {
    event.preventDefault();
    const finalUrl = this.formatUrl();
    const response = await fetch(finalUrl); // finalUrl variable used for testing
    const json = await response.json();
    this.setState({ results: json, url: finalUrl }, () =>
      console.log('results', this.state.results)
    );
  };

  handleTextChange = event => {
    this.setState({ searchText: event.target.value });
  };

  handleToggleChange = event => {
    const { toggledLabels } = this.state;
    this.setState({
      toggledLabels: { ...toggledLabels, [event.target.name]: !toggledLabels[event.target.name] },
    });
  };

  render() {
    const { results, searchText, toggledLabels, url } = this.state;

    return (
      <div className="wrapper">
        <Title />
        {/* <div className="searchbar">
          <h3>Enter Your Search</h3>
          <form>
            <input type="text" value={searchText} onChange={this.handleTextChange} />
            <button type="submit" onClick={this.getIssues}>
              Get Results
            </button>
          </form>
        </div> */}
        <SearchBar
          handleTextChange={this.handleTextChange}
          handleButtonClick={this.getIssues}
          searchText={searchText}
        />
        <br />
        <br />
        <div>
          <Toggle
            defaultChecked={toggledLabels.bug}
            icons={false}
            name="bug"
            onChange={this.handleToggleChange}
          />
          <span>bug</span>
        </div>
        <div>
          <Toggle
            defaultChecked={toggledLabels.easy}
            icons={false}
            name="easy"
            onChange={this.handleToggleChange}
          />
          <span>easy</span>
        </div>
        <div>
          <Toggle
            defaultChecked={toggledLabels.documentation}
            icons={false}
            name="documentation"
            onChange={this.handleToggleChange}
          />
          <span>documentation</span>
        </div>
        <div>
          <Toggle
            defaultChecked={toggledLabels.helpWanted}
            icons={false}
            name="help-wanted"
            onChange={this.handleToggleChange}
          />
          <span>help-wanted</span>
        </div>
        <br />
        {results.items && url} {/* for testing */}
        {results.items && <SearchResults results={results} />}
      </div>
    );
  }
}

export default App;
