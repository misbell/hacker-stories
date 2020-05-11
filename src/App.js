import React from 'react';

const welcome = {
  greeting: 'Working',
  title: 'Example',
};

function getTitle(title) {
  return title;
};

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: 0,
  },
  {
    title: 'redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark',
    num_comments: 2,
    points: 5,
    objectID: 1,
  },
  {
    title: 'kafka',
    url: 'https://kafka.apache.org/',
    author: 'Jim Swift',
    num_comments: 232,
    points: 225,
    objectID: 3,
  },

];

// short version
// const getAsyncStories = () =>
//   Promise.resolve({ data: { stories: initialStories } });

// long version
// const getAsyncStories = () =>
//   new Promise(resolve =>
//     resolve({ data: { stories: initialStories } })
//   );

//artificial delay for demo of async
const getAsyncStories = () =>
  new Promise(resolve =>
    setTimeout(
      () => resolve({ data: { stories: initialStories } }),
      2000
    )
  );

const useSemiPersistentState = (key, initialState) => {
  const [value, setValue] =
    React.useState(
      localStorage.getItem(key) || initialState
    );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value]);

  return [value, setValue];

};

const App = () => {

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search', 'React');

  const [stories, setStories] = React.useState([]);

  React.useEffect(() => {
    getAsyncStories().then(result => {
      setStories(result.data.stories);
    });
  }, []);

  const handleRemoveStory = item => {
    const newStories = stories.filter(
      story => item.objectID != story.objectID
    );
    setStories(newStories);
  }

  React.useEffect(() => {
    localStorage.setItem('search', searchTerm);
  }, [searchTerm]);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const searchedStories = stories.filter(function (story) {

    return story.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

  });

  // block syntax not concise syntax
  // because code before the return

  return (
    <div>
      <h1>{welcome.greeting} {welcome.title}</h1>

      <h1>{getTitle('Interactive Search')}</h1>

      <InputWithLabel
        id="search"
        label="Search"
        value={searchTerm}
        isFocused
        onInputChange={handleSearch}
      >
        <strong>Search:</strong>
      </InputWithLabel>
      />

      <hr />

      <List list={searchedStories} onRemoveItem={handleRemoveStory} />

    </div>
  );
};

const InputWithLabel = (
  {
    id,
    label,
    value,
    type = 'text',
    onInputChange,
    isFocused,
    children,
  }) => {

  // imperative code

  const inputRef = React.useRef();

  React.useEffect(() => {

    if (isFocused && inputRef.current) {
      inputRef.current.focus();
    }

  }, [isFocused]);

  // imperative code ends

  return (
    <>
      <label htmlFor={id}>{children}</label>
        &nbsp;
      <input
        id={id}
        type={type}
        value={value}
        autoFocus={isFocused}
        onChange={onInputChange}
      />
    </>
  );

};

const Search = ({ search, onSearch }) => {

  return (
    <>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text"
        value={search}
        onChange={onSearch} />
    </>
  )
}

// MPI a react component
// and a leaf component
// since it doesn't render any other components.
// concise syntax

// versions of List and Item MPI
// const List = ({ list }) =>
//   list.map(({ objectID, ...item }) => // ... here is 'rest of' operator
//     <Item key={item.objectID}
//       {...item} //... here is spread operator
//     />);

// const List = ({ list }) =>
//   list.map(item =>
//     <Item key={item.objectID}
//       title={item.title}
//       url={item.url}
//       author={item.author}
//       num_comments={item.num_comments}
//       points={item.points}
//     />);

// const Item = ({ title, url, author, num_comments, points }) => (
//   <div>
//     <span>
//       <a href={url}>{title}</a>
//     </span>
//     <span>{author}</span>
//     <span>{num_comments}</span>
//     <span>{points}</span>
//   </div>
// )

const List = ({ list, onRemoveItem }) =>
  list.map(item => (
    <Item
      key={item.objectID}
      item={item}
      onRemoveItem={onRemoveItem}
    />
  ));

const Item = ({ item, onRemoveItem }) => {
  // const handleRemoveItem = () => {
  //   onRemoveItem(item);
  // };
  function handleRemoveItem() {
    onRemoveItem(item); // MPI same thing
  }

  return (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        {/* <button type="button" onClick={handleRemoveItem}> */}
        {/* <button type="button" onClick={onRemoveItem.bind(null, item)}> */}
        <button type="button" onClick={() => { onRemoveItem(item) }}>
          {/* all three lines end up doing same thing MPI */}
          Dismiss
          </button>
      </span>
    </div >
  )
}

export default App;
