import react, {useEffect, useState} from 'react';
import { useDebounce } from './utlilities';
import axios from 'axios';
import './App.scss';

const apiStuff = {
  key:'3bda19b2b236ce6c68da0751faba9abe',
  base:'https://api.themoviedb.org/3/',
  search:'search/movie',
  params: '&language=en-US&page=1&include_adult=false'
}

function App() {

  const [searchTerm, setSearchTerm ] = useState('Search Me!');
  const [ results, setResults ] = useState([]);
  // const [menuOpen, setMenuOpen] = useState= (false);
  const debounceSearchTerm = useDebounce(searchTerm, 500);
  console.log(searchTerm);

  const apiKey = apiStuff.key;
  const baseURL = apiStuff.base;
  const searchPath = apiStuff.search;
  const extraParams = apiStuff.params;
  const url = `${baseURL}${searchPath}?api_key=${apiKey}${extraParams}`;

  console.log(url);

  const getMovie = async (url, query) => {
    try{
      const response = await axios.get(`${url}&query=${query}`);
      console.log(response.data);
      setResults(response.data.results);
    } catch(err){
      console.log(err.message, err.code)
    }
  };

  const sortMovies = (res, order) => {
    let resultCopy = [... res];

    switch(order){
      case 'asc':
        resultCopy = resultCopy.sort((a,b) => a.vote_average - b.vote_average);
        setResults(resultCopy);
        break;
        default:
          resultCopy = resultCopy.sort((a,b) => b.vote_average - a.vote_average);
          setResults(resultCopy);
    }
  }

  useEffect(() =>{
    if (debounceSearchTerm){
      getMovie(url, debounceSearchTerm);
    }else{
      setResults([]);
    }
  },[debounceSearchTerm,url]);

  return (
    <div className="App">
      <aside className="sidebar">
        Sidebar
      </aside>
      {/* <button className="hamburger">Hamburger</button> */}
      <div className="search">
        <h1>My movie search app</h1>
        <div className="search-btn">
          <button onClick={() => sortMovies(results, 'asc')}>Sort ASC</button>
          <button onClick={() => sortMovies(results, 'dsc')}>Sort DSC</button>
        </div>
        
      </div>

      <input type="text" 
      value={searchTerm} 
      onChange={(e) => setSearchTerm(e.target.value)} />
      {results.map((result, i )=> (
        <div className="body" key={i}>
          <figure >
            {result.poster_path ? <img src={`https://image.tmdb.org/t/p/w200/${result.poster_path}`} alt={result.title} /> : null};
            <figcaption>{result.title}</figcaption>
            <p>{result.release_date}</p>
            <p>{result.overview}</p>
            <p>{result.vote_average}/10</p>
          </figure>
        </div>
        

      ))}

    </div>
  );
}

export default App;
